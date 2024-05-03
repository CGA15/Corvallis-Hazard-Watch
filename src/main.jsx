import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react';

// import MapPage from './MapPage'
import App from './App'
import './index.css'






const providerConfig = {
  domain: import.meta.env.REACT_APP_AUTH0_DOMAIN,
  clientId: import.meta.env.REACT_APP_AUTH0_CLIENT_ID,
  //onRedirectCallback,
  authorizationParams: {
    //redirect_uri: window.location.origin,
    ...(import.meta.env.REACT_APP_AUTH0_AUDIENCE ? { audience: import.meta.env.REACT_APP_AUTH0_AUDIENCE } : {}),
  },
};



ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>

            <App />
 
    </React.StrictMode>,
)
