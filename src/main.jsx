import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Provider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react'


import store from './redux/store'
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
        <Auth0Provider
      domain="dev-6m2d6yf4ffilgk3i.us.auth0.com"
      clientId="kzqh8vmwcVoVFm5ipNO8rxmYsjMg8950"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
        <Provider store ={store}>
            <App />
        </Provider>
        </Auth0Provider>
    </React.StrictMode>,
)
