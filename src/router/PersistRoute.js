/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Loading from "components/DRLoading";
import { useSelector } from "react-redux";
import useRefreshToken from "hooks/useRefreshToken";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const refresh = useRefreshToken();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
        console.log("Refresh");
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !token ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  if (error) {
    return (
      <Navigate
        to="/authentication/sign-in"
        state={{ from: location }}
        replace
      />
    );
  }
  return isLoading ? <Loading /> : <Outlet />;
}

export default PersistLogin;
