import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { UserDetails } from "../components/utils/Callback";

const useRefreshToken = () => {
  const navigate = useNavigate()
  const refresh = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/refresh`,{withCredentials:true});
      if (res.status !== 401) {
        const userDetailsRes = res.data as unknown as UserDetails;
        return userDetailsRes.accessToken;
      } else {
        console.error("Invalid response format");
        localStorage.clear()
        navigate('/auth')
        return null;
      }
    } catch (error) {
      navigate('/auth')
    }
  };

  return refresh;
}

export default useRefreshToken;