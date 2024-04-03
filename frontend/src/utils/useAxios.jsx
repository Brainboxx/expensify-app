import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const baseURL = "https://expensify-tyv2.onrender.com/"

const useAxios = () => {
    const {authTokens, setUser, setAuthTokens} = useContext(AuthContext)

    const axiosInstance = axios.create({
        baseURL,
        headers: {Authorization: `Bearer ${authTokens?.access}`}
    })

    axiosInstance.interceptors.request.use(
        async (req) => {
          try {
            const user = jwtDecode(authTokens.access);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      
            if (!isExpired) {
              return req;
            }
      
            const response = await refreshToken();
            req.headers.Authorization = `Bearer ${response.data.access}`;
            return req;
          } catch (error) {
            console.error("Token refresh failed:", error);
            throw new Error("Token refresh failed. Please login again.");
          }
        },
        (error) => {
          console.error("Request error:", error);
          return Promise.reject(error);
        }
      );
      
      async function refreshToken() {
        try {
          const response = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: authTokens.refresh,
          });
          localStorage.setItem("authTokens", JSON.stringify(response.data));
          setAuthTokens(response.data);
          setUser(jwtDecode(response.data.access));
          return response;
        } catch (error) {
          console.error("Token refresh request failed:", error);
          throw new Error("Failed to refresh token. Please login again.");
        }
      }
      

    return axiosInstance
}

export default useAxios