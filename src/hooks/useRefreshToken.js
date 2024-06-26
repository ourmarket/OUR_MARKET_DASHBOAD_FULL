import axios from "api/axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "reduxToolkit/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    const response = await axios.get("/auth/dashboard/refresh", {
      withCredentials: true,
    });

    dispatch(setCredentials({ ...response.data }));
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
