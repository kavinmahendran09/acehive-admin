import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import Supabase client
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is included
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting
import { FaDatabase, FaHome, FaSignOutAlt, FaRedo, FaPlus } from 'react-icons/fa'; // Import React Icons
import { Circles } from 'react-loader-spinner'; // Import loading spinner (react-loader-spinner)
import ContentManagement from './ContentManagement';
import Database from './Database'; // Assuming you have a Database component

const Dashboard: React.FC = () => {
  const [totalCount, setTotalCount] = useState<number>(0); // Total resource count
  const [ctPapersCount, setCtPapersCount] = useState<number>(0); // Count for CT Papers
  const [semPapersCount, setSemPapersCount] = useState<number>(0); // Count for Sem Papers
  const [studyMaterialsCount, setStudyMaterialsCount] = useState<number>(0); // Count for Study Materials
  const [loading, setLoading] = useState<boolean>(false); // For loading state
  const [currentView, setCurrentView] = useState<string>('content'); // State to manage the current view
  const navigate = useNavigate(); // Initialize navigate for redirecting

  // Fetch data from Supabase
  const fetchResourceCounts = async () => {
    setLoading(true);

    try {
      // Get total count of resources
      const { count: totalCount } = await supabase
        .from('resources')
        .select('*', { count: 'exact' });

      // Get count of CT Papers
      const { count: ctPapersCount } = await supabase
        .from('resources')
        .select('*', { count: 'exact' })
        .eq('resource_type', 'CT Paper');

      // Get count of Sem Papers
      const { count: semPapersCount } = await supabase
        .from('resources')
        .select('*', { count: 'exact' })
        .eq('resource_type', 'Sem Paper');

      // Get count of Study Materials
      const { count: studyMaterialsCount } = await supabase
        .from('resources')
        .select('*', { count: 'exact' })
        .eq('resource_type', 'Study Material');

      // Update the state with fetched counts
      setTotalCount(totalCount || 0);
      setCtPapersCount(ctPapersCount || 0);
      setSemPapersCount(semPapersCount || 0);
      setStudyMaterialsCount(studyMaterialsCount || 0);
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchResourceCounts();
  }, []);

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
    <div className="d-flex flex-column h-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
        <div className="bg-dark text-white col-md-2 p-3" style={{ position: 'fixed', top: 0, bottom: 0 }}>
          <ul className="nav flex-column">
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="/" onClick={() => setCurrentView('content')}>
                <FaHome className="me-2" />
                Home
              </a>
            </li>

            {/* Add Section */}
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#" onClick={() => setCurrentView('content')}>
                <FaPlus className="me-2" />
                Add
              </a>
            </li>

            {/* Database Section */}
            <li className="nav-item mb-3">
              <a className="nav-link text-white" href="#" onClick={() => setCurrentView('database')}>
                <FaDatabase className="me-2" />
                Database
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link text-white" href="#" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <main className="col-md-10 p-4" style={{ marginLeft: '16.6667%' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="h2" style={{ fontWeight: 'bold', fontSize: '2rem' }}>
              Resources Added So Far
            </h2>
            <button
              className="btn btn-primary"
              onClick={fetchResourceCounts}
              disabled={loading}
            >
              <FaRedo />
            </button>
          </div>

          {/* Cards */}
          <div className="row">
            {/* Total Card */}
            <div className="col-md-3 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Total</h5>
                  <p className="card-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {loading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                        <Circles color="dark" height={50} width={50} />
                      </div>
                    ) : (
                      totalCount
                    )}
                  </p>
                </div>
                <div className="card-footer" style={{ backgroundColor: '#00BFFF', height: '4px' }}></div>
              </div>
            </div>

            {/* CT Papers Card */}
            <div className="col-md-3 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>CT Papers</h5>
                  <p className="card-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {loading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                        <Circles color="dark" height={50} width={50} />
                      </div>
                    ) : (
                      ctPapersCount
                    )}
                  </p>
                </div>
                <div className="card-footer" style={{ backgroundColor: '#FF5733', height: '4px' }}></div>
              </div>
            </div>

            {/* Sem Papers Card */}
            <div className="col-md-3 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Sem Papers</h5>
                  <p className="card-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {loading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                        <Circles color="dark" height={50} width={50} />
                      </div>
                    ) : (
                      semPapersCount
                    )}
                  </p>
                </div>
                <div className="card-footer" style={{ backgroundColor: '#28A745', height: '4px' }}></div>
              </div>
            </div>

            {/* Study Material Card */}
            <div className="col-md-3 mb-4">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Study Material</h5>
                  <p className="card-text" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {loading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                        <Circles color="dark" height={50} width={50} />
                      </div>
                    ) : (
                      studyMaterialsCount
                    )}
                  </p>
                </div>
                <div className="card-footer" style={{ backgroundColor: '#FFC107', height: '4px' }}></div>
              </div>
            </div>
          </div>

          {/* Horizontal line below cards */}
          <hr style={{ border: '1px solid #ddd' }} />
          
          {/* Conditionally render based on current view */}
          {currentView === 'content' ? <ContentManagement /> : <Database />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
