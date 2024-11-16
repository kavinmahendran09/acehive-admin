import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Import Supabase client
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap is included
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting

const Dashboard: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>(''); // Selected table
  const [data, setData] = useState<any[]>([]); // To hold data from the selected table
  const [columns, setColumns] = useState<string[]>([]); // To hold column names
  const [errorMessage, setErrorMessage] = useState<string>(''); // For error message
  const [loading, setLoading] = useState<boolean>(false); // For loading state
  const navigate = useNavigate(); // Initialize navigate for redirecting

  // Handle table selection
  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tableName = event.target.value;
    setSelectedTable(tableName);
    fetchData(tableName); // Fetch data for the selected table
  };

  // Fetch data from the selected table
  const fetchData = async (tableName: string) => {
    setLoading(true);
    setData([]);
    setColumns([]);
    try {
      const { data, error } = await supabase
        .from(tableName) // Dynamically query the selected table
        .select('*');

      if (error) {
        setErrorMessage(`Failed to fetch data from ${tableName}`);
        console.error(error);
      } else {
        setData(data);
        if (data.length > 0) {
          setColumns(Object.keys(data[0])); // Set columns from the first row of the data
        }
      }
    } catch (err) {
      setErrorMessage('Error connecting to the database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter columns based on table selection
  const getFilteredColumns = () => {
    let filteredColumns = columns;

    if (selectedTable !== 'auth') {
      // Hide the 'id' column for tables other than 'auth'
      filteredColumns = filteredColumns.filter((col) => col !== 'id');
    }

    if (selectedTable === 'resources') {
      // Hide 'description' and 'file_urls' for the 'resources' table
      filteredColumns = filteredColumns.filter((col) => col !== 'description' && col !== 'file_urls');
    }

    return filteredColumns;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Log out the user
      navigate('/'); // Redirect to the login page (adjust the path as necessary)
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Acehive</a>
          <button className="btn btn-outline-light" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="d-flex" style={{ marginTop: '56px', minHeight: '100vh' }}>
        {/* Sidebar */}
        <nav className="bg-dark text-white col-md-2 d-none d-md-block sidebar p-3" style={{ minHeight: '100vh', position: 'fixed', top: 0 }}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Users</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Reports</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#">Settings</a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="col-md-10 p-4" style={{ marginLeft: '16.6667%' }}>
          <h2 className="h2">Dashboard</h2>

          {/* Table Selection Dropdown */}
          <div className="mb-4">
            <label htmlFor="tableSelect" className="form-label">
              Select Table to View
            </label>
            <select
              id="tableSelect"
              className="form-select"
              value={selectedTable}
              onChange={handleTableChange}
            >
              <option value="">Select a Table</option>
              <option value="auth">Auth</option>
              <option value="collaborations">Collaborations</option>
              <option value="resources">Resources</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>

          {/* Alert for error */}
          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Data Table */}
          {selectedTable && (
            <div className="table-responsive mt-4">
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      {/* Dynamically create table headers based on filtered columns */}
                      {getFilteredColumns().map((column, index) => (
                        <th key={index} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Dynamically create table rows based on data */}
                    {data.map((row, index) => (
                      <tr key={index}>
                        {getFilteredColumns().map((column, colIndex) => (
                          <td key={colIndex}>{row[column]}</td> // Display each cell based on column name
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
