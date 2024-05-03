import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const {loginWithRedirect, logout, user, isLoading} = useAuth0();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;