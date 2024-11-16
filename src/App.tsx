import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <AppRouter />  {/* This will handle routing */}
      </Router>
    </div>
  );
};

export default App;
