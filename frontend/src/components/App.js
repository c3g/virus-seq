import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { useSelector } from 'react-redux'
import { USER_TYPE } from '../constants'
import Navbar from './navbar/Navbar';
import routes from './routes'
import './App.css';

function App() {
  const user = useSelector(s => s.auth.user)

  return (
    <Router>
      <div className='App'>
        <Navbar />

        <Switch>
          {routes.list.map(r =>
            <Route
              key={r.path}
              path={r.path}
              render={() => {
                if (r.login && !user)
                  return <Redirect to={routes.byName.login} />
                if (r.admin && user?.type !== USER_TYPE.ADMIN)
                  return <Redirect to={routes.byName.profile} />
                return r.render()
              }}
            />
          )}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
