import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

interface TableRow {
  [key: string]: any; 
}

const Database: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('resources');
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string>(''); 

  
  const [yearFilter, setYearFilter] = useState<string>(''); 
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>(''); 
  const [searchQuery, setSearchQuery] = useState<string>(''); 

  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);

  const fetchTableData = async (table: string) => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        setError('Error fetching data from Supabase');
      } else {
        setTableData(data || []);
        setFilteredData(data || []); 
        setFiltersApplied(false); 
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(selectedTable);
  }, [selectedTable]);

  const filterColumns = (row: TableRow) => {
    if (selectedTable === 'resources') {
      const filteredRow = { ...row };
      delete filteredRow.description; 
      delete filteredRow.file_urls; 
      delete filteredRow.id;
      delete filteredRow.tags;
      delete filteredRow.created_at;
      return filteredRow;
    }
    return row; 
  };

  const applyFilters = () => {
    let filtered = tableData;

    if (yearFilter) {
      filtered = filtered.filter((row) => row.year === yearFilter);
    }

    if (resourceTypeFilter) {
      filtered = filtered.filter((row) => row.resource_type === resourceTypeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((row) => {
        return row.title && row.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    setFilteredData(filtered);
    setFiltersApplied(true); 
  };

  const resetFilters = () => {
    setYearFilter('');
    setResourceTypeFilter('');
    setSearchQuery('');
    setFilteredData(tableData);
    setFiltersApplied(false); 
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === '') {
      setFilteredData(tableData); 
    } else {
      const filtered = tableData.filter((row) =>
        row.title && row.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Database Table Viewer</h2>

      {/* Dropdown to select table */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <select
          className="form-select w-auto me-3"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="resources">Resources</option>
          <option value="feedback">Feedback</option>
          <option value="collaborations">Collaborations</option>
        </select>
        <button
          className="btn btn-success"
          onClick={() => {
            fetchTableData(selectedTable);
            setFiltersApplied(false); 
          }}
        >
          Refresh
        </button>
      </div>

      {/* Filters for the 'resources' table */}
      {selectedTable === 'resources' && (
        <div className="row mb-4">
          <div className="col">
            <select
              className="form-select"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
            </select>
          </div>
          <div className="col">
            <select
              className="form-select"
              value={resourceTypeFilter}
              onChange={(e) => setResourceTypeFilter(e.target.value)}
            >
              <option value="">Select Resource Type</option>
              <option value="CT Paper">CT Paper</option>
              <option value="Sem Paper">Sem Paper</option>
              <option value="Study Material">Study Material</option>
            </select>
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={handleSearchChange} 
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
          <div className="col-auto">
            <button className="btn btn-secondary" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Display applied filters status */}
      {filtersApplied && (
        <div className="alert alert-info d-flex justify-content-between">
          <span>Filters Applied</span>
          <button className="btn btn-link" onClick={resetFilters}>
            Remove Filters
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Table to display data */}
      {!loading && !error && filteredData.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                {Object.keys(filterColumns(filteredData[0])).map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.values(filterColumns(row)).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No data available message */}
      {!loading && !error && filteredData.length === 0 && (
        <div className="alert alert-info text-center" role="alert">
          No data available for the selected filters.
        </div>
      )}
    </div>
  );
};

export default Database;
