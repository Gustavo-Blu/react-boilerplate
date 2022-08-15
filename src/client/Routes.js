import React, { Component, Fragment, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withRouter, Route, Routes, Redirect } from 'react-router-dom';
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import { fetchAuth } from './store/auth';
/**
 * COMPONENT
 */
const ReactRoutes = (props) => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuth());
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <Routes>
          <Route path="/home" element={<Home />} />
          <Redirect to="/home" />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </Routes>
      )}
    </div>
  );
};

// class Routes extends Component {
//   componentDidMount() {
//     this.props.loadInitialData();
//   }

//   render() {
//     const { isLoggedIn } = this.props;

//     return (
//       <div>
//         {isLoggedIn ? (
//           <Switch>
//             <Route path="/home" component={Home} />
//             <Redirect to="/home" />
//           </Switch>
//         ) : (
//           <Switch>
//             <Route path="/" exact component={Login} />
//             <Route path="/login" component={Login} />
//             <Route path="/signup" component={Signup} />
//           </Switch>
//         )}
//       </div>
//     );
//   }
// }

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(ReactRoutes));
