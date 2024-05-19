import React from "react";

const loadingImg =
  "https://cdn.auth0.com/blog/auth0-react-sample/assets/loading.svg";

const Loading = () => {
    return 
        <>
            <div className="spinner">
                <img src={Loading} alt="Loading..." />
            </div>
        </>
    };

export default Loading;