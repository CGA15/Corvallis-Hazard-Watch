import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const { logout, user, isLoading} = useAuth0();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <button onClick={() => logout({logoutParams: {returnTo: window.location.origin,}})}>Log <output></output></button>;
};

<<<<<<< Updated upstream
export default LoginButton;
=======
export default LoginButton;3
>>>>>>> Stashed changes
