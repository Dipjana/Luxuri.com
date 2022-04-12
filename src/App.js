import React from "react";
import {
  BrowserRouter as Router
} from "react-router-dom";
import {history} from "./history";

import {AuthProvider} from './AuthContext';
import Layout from './common/layout/Layout'
import HttpsRedirect from 'react-https-redirect';
export class SplashScreen extends React.Component {
  render() {
    const styleob = {
      top: '47%',
      left: '47%',
      position: 'fixed'
    };
    
    const { REACT_APP_PUBLIC_URL } = process.env;
    return (
      <img src={REACT_APP_PUBLIC_URL+'/images/loader.gif'} style={styleob}/>
    );
  }
}
function App() {

  const { REACT_APP_BASENAME } = process.env;



  return (
    <HttpsRedirect>
    <AuthProvider>
      <Router history={history} basename={REACT_APP_BASENAME}>
        <React.Suspense fallback={<SplashScreen/>}>
          <Layout/>
        </React.Suspense>
      </Router>
    </AuthProvider>
    </HttpsRedirect>
  );
}


export default App;
