import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "components/DRLoading";

export default function PublicRoute({ children }) {
  const { user, loaded } = useSelector((state) => state.auth);

  if (!loaded ) {
    return <Loading />;
  } 

  if (user) {
    return <Navigate to="/dashboard/totales" replace />;
  }

  // OK
  return children;
}
