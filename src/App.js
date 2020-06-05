import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, withRouter, Route, Redirect, Link, Switch } from "react-router-dom";
import Media from "react-media";
import auth from './firebase/auth';
import './App.css';

import { AuthProvider, useAuthState } from './AppContext'
const App = () => (
  <AuthProvider>
    <Routes />
  </AuthProvider>
);

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" render={() => <SignIn />} />
    </Switch>
    <Media query="(max-width: 599px)">
      {matches =>
        matches ? (
          <Switch>
            <PrivateRoute
              exact
              path="/mobile"
              component={LoadChannels}
            />
            <Redirect from="/dashboard" to="/mobile" />
          </Switch>
        ) : (
            <Switch>
              <PrivateRoute
                path="/dashboard"
                component={UsersDashBoard}
              />
              <Redirect from="/mobile" to="/dashboard" />
            </Switch>
          )
      }
    </Media>
  </Router>
)

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [authUser, initializing] = useAuthState();
  return (
    <Route
      {...rest}
      render={props =>
        !initializing ? (
          authUser.uid ? (
            <Component {...props} />
          ) : (
              <Redirect to={{
                pathname: "/",
                state: {
                  from: props.location,
                }
              }} />
            )
        ) : (
            <b>Loading....</b>
          )
      }
    />
  );
}


const UsersDashBoard = ({ match, location }) =>
  (
    <>
      <LoadChannels match={match} />
    </>
  )

const SignIn = () => {
  const [trigger, setTrigger] = useState({
    anonymous: 0,
    google: 0,
    email: 0,
  })

  let googleAuth = trigger['google'];
  let anonymousAuth = trigger['anonymous'];
  let emailAuth = trigger['email'];

  let SignInWithGoogleRedirect = async () => {
    console.log('google');
  }

  let SignInWithAnonymousAuth = async () => {
    try {
      let authUser = await auth.anonymousSignIn();
      console.log(authUser.uid);
    }
    catch (error) {
      console.log(error);
    }
  }

  let signInWithEmail = async () => {
    try {
      let email = window.prompt('whats your email address');
      window.localStorage.setItem('email', email);
      await auth.emailSignIn(email)
      console.log(`email ${email} sent an auth link`)
    } catch (error) {
      console.log(error)
    }
  }

  let completeSignInWithEmail = async () => {
    try {
      let email = window.localStorage.getItem('email');
      let authUser = await auth.completeEmailSignIn(email);
      window.localStorage.removeItem('email');
      console.log(authUser);
    } catch (error) {
      console.log(error);
    }
  }

  let setTriggerVal = (key) => {
    setTrigger({
      ...trigger,
      [key]: trigger[key] + 1
    })
  }

  useEffect(() => {
    if (googleAuth) SignInWithGoogleRedirect()
  }, [googleAuth])

  useEffect(() => {
    if (anonymousAuth) SignInWithAnonymousAuth()
  }, [anonymousAuth])

  useEffect(() => {
    if (emailAuth) signInWithEmail()
  }, [emailAuth])

  useEffect(() => {
    let email = window.localStorage.getItem('email');
    if (email) completeSignInWithEmail();
  }, [])

  return (
    <div>
      <b> Welcome to the Demo for Auth </b>
      <br />
      <button onClick={() => setTriggerVal('anonymous')}> Sign In Anonymously </button>
      <br />
      <button onClick={() => setTriggerVal('google')}> Sign In With Google </button>
      <br />
      <button onClick={() => setTriggerVal('email')}> Sign In With Email </button>
    </div>)
}

const LoadChannels = () => (
  <>
    <b> Hello </b>
  </>
)
export default App;
