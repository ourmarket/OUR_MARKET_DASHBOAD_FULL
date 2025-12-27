import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { setCredentials, logOut } from "reduxToolkit/authSlice";
import { useGetMeQuery } from "api/authApi";
import Swal from "sweetalert2";


export default function SessionLoader({ children }) {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const dispatch = useDispatch();
  const user = useUser();
  

  const {
    data,
    isSuccess,
    isError,
    error,
  } = useGetMeQuery(undefined, {
    skip: !isLoaded || !isSignedIn,
  });

  // ❌ Clerk cargó pero no hay sesión
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      dispatch(logOut());
    }
  }, [isLoaded, isSignedIn]);

  // ✅ Sesión válida → datos de backend
  useEffect(() => {
    const handleSession = async () => {
      if (isSuccess && data) {
        dispatch(setCredentials(data));
      }

      if (isError) {
        Swal.fire({
          title: 'Error',
          text: error?.data?.msg || 'Ocurrió un error al cargar la sesión',
          icon: 'error',
          confirmButtonColor: '#0891b2',
        });
        //await signOut();
        dispatch(logOut());
      }
    };

    handleSession();
  }, [isSuccess, isError, data, error, signOut, dispatch]);

  return children;
}
