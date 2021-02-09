import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Navbar from './navbar/Navbar';
import routes from './routes'
import './App.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar />

        <Switch>
          {routes.list.map(r =>
            <Route key={r.path} path={r.path} render={r.render} />
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
