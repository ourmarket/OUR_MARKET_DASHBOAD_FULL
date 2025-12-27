import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "components/DRLoading";

export default function RequireAuth({ children }) {
  const { user, loaded } = useSelector((state) => state.auth);

  // Todavía no sabemos si está logueado
  if (!loaded) {
    return <Loading />;
  }

  // Ya cargó y NO está logueado
  if (!user) {
    return <Navigate to="/authentication/sign-in" replace />;
  }

  // OK
  return children;
}
