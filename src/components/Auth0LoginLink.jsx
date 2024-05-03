export default function Auth0LoginLink() {
    const queryParams = new URLSearchParams({
      client: import.meta.env.REACT_APP_AUTH0_CLIENT_ID,
      client_secret: import.meta.env.AUTH0_SECRET_KEY,

      //redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URL,
      response_type: 'code',
      scope: 'openid profile email', // Add any additional scopes as needed
      //audience: 'YOUR_AUTH0_AUDIENCE', // Replace with your Auth0 audience
    })
    const baseUrl = "dev-vhmvmlmfxw5prrbg.us.auth0.com"
    const url = `https://${baseUrl}/login?${queryParams.toString()}`

    //https://YOUR_DOMAIN.auth0.com/login?client=YOUR_CLIENT_ID&protocol=oauth2&response_type=token&redirect_uri=YOUR_CALLBACK_URL
    console.log("== url:", url)
    return <a href={url}>Login with Auth0</a>
  }
  