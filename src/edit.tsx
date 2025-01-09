import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrashAlt } from 'react-icons/fa';

interface TableRow {
  [key: string]: any;
}

const Edit: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('resources');
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);
  const [editingRow, setEditingRow] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [updatedData, setUpdatedData] = useState<{ [key: string]: TableRow }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);

  const excludedColumns = ['description', 'created_at', 'file_urls', 'tags','id'];

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

  const handleInputChange = (rowId: string, field: string, value: string) => {
    setUpdatedData((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: value },
    }));
  };

  const enableEditing = (rowId: string) => {
    setEditingRow((prev) => ({ ...prev, [rowId]: true }));
    const row = tableData.find((r) => r.id === rowId);
    if (row) {
      setUpdatedData((prev) => ({
        ...prev,
        [rowId]: { ...row },
      }));
    }
  };

  const saveChanges = async (rowId: string) => {
    const updatedRow = updatedData[rowId];
    try {
      const { error } = await supabase
        .from(selectedTable)
        .update(updatedRow)
        .eq('id', rowId);

      if (error) {
        alert('Error saving changes: ' + error.message);
      } else {
        alert('Changes saved successfully!');
        setEditingRow((prev) => ({ ...prev, [rowId]: false }));
        fetchTableData(selectedTable); 
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred');
    }
  };


  const handleDelete = async (rowId: string) => {
    try {
      const { error } = await supabase.from(selectedTable).delete().eq('id', rowId);

      if (error) {
        alert('Error deleting record: ' + error.message);
      } else {
        alert('Record deleted successfully!');
        fetchTableData(selectedTable); 
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred');
    } finally {
      setShowDeleteModal(false);
      setRowToDelete(null);
    }
  };


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(tableData);
    } else {
      const filtered = tableData.filter((row) =>
        row.title?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Edit Database Table</h2>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <select
          className="form-select w-auto me-3"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="resources">Resources</option>
        </select>
        <button
          className="btn btn-success"
          onClick={() => fetchTableData(selectedTable)}
        >
          Refresh
        </button>
        {selectedTable === 'resources' && (
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        )}
      </div>

      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && filteredData.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                {Object.keys(filteredData[0])
                  .filter((column) => !excludedColumns.includes(column))
                  .map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id}>
                  {Object.keys(row)
                    .filter((field) => !excludedColumns.includes(field))
                    .map((field) => (
                      <td key={field}>
                        {editingRow[row.id] ? (
                          <input
                            type="text"
                            className="form-control"
                            value={updatedData[row.id]?.[field] || row[field]}
                            onChange={(e) =>
                              handleInputChange(row.id, field, e.target.value)
                            }
                          />
                        ) : (
                          row[field]
                        )}
                      </td>
                    ))}
                  <td>
                    {editingRow[row.id] ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => saveChanges(row.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() =>
                            setEditingRow((prev) => ({
                              ...prev,
                              [row.id]: false,
                            }))
                          }
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => enableEditing(row.id)}
                      >
                        Edit
                      </button>
                    )}
                    <FaTrashAlt
                      className="text-danger"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setRowToDelete(row.id);
                        setShowDeleteModal(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <div className="alert alert-info text-center" role="alert">
          No data available in the selected table.
        </div>
      )}

      {showDeleteModal && (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this record? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => rowToDelete && handleDelete(rowToDelete)}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;
