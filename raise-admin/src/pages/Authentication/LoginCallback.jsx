import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from 'reactstrap';

const LoginCallback = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const dataParam = queryParams.get("data");

    if (dataParam) {
      try {
        const { token, user } = JSON.parse(decodeURIComponent(dataParam));

        localStorage.setItem("authUser", token);
        localStorage.setItem("user", JSON.stringify(user));

        const roleName = user.roleId?.name?.toLowerCase() || "brand";  
        navigate(`/overview/${roleName}`);

      } catch (error) {
        
        console.error("Error parsing auth data:", error);
        navigate("/login");
      }
    } else {
      
      navigate("/login");
    }
  }, [location, navigate]);

  return(
    <>
      <div className='loading-tiktok-page'>
        <Spinner style={{ color: "var(--primary-purple)" }} />
        <p >Logging in with TikTok...</p>
    </div>
    </>
  );
};

export default LoginCallback;
