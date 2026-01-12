import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "components/DRLoading";

export default function PublicRoute({ children }) {
  const { user, loaded } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!loaded) {
    return <Loading />;
  }

  if (user) {
    const from = location.state?.from?.pathname || "/dashboard/totales";
    return <Navigate to={from} replace />;
  }

  // OK
  return children;
}
