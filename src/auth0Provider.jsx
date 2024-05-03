import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';


const Auth0ProviderWithHistory = ({ children }) => {
    //const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    //const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

    //const domain = "dev-vhmvmlmfxw5prrbg.us.auth0.com";//import.meta.env.REACT_APP_AUTH0_DOMAIN;
    //const clientId = "dFZ1vvXW6L7OMVUXtxQikgz2MGdcFcrL";//import.meta.env.REACT_APP_AUTH0_CLIENT_ID;

    const domain = "dev-6m2d6yf4ffilgk3i.us.auth0.com";//import.meta.env.REACT_APP_AUTH0_DOMAIN;
    const clientId = "kzqh8vmwcVoVFm5ipNO8rxmYsjMg8950";//import.meta.env.REACT_APP_AUTH0_CLIENT_ID;

    //const domain = process.env.REACT_APP_AUTH0_DOMAIN;//import.meta.env.REACT_APP_AUTH0_DOMAIN;
   // const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;//import.meta.env.REACT_APP_AUTH0_CLIENT_ID;

    //print domain and client id to console
    console.log("== domain:", domain)
    console.log("== clientId:", clientId)

    const history = useNavigate();

    const onRedirectCallback = (appState) => {
        history.pushState(appState?.returnTo || window.location.pathname);
    };

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            redirectUri={window.location.origin }
            onRedirectCallback={onRedirectCallback}
            authorizationParams={{ redirect_uri: window.location.origin  }}
        >
            {children}
        </Auth0Provider>
    );
};

export default Auth0ProviderWithHistory;