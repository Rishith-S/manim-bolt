import axios from "axios";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
export interface UserDetails {
  name: string;
  email: string;
  accessToken: string;
  message:string;
  picture?:string;
}
export default function Callback() {
  const location = useLocation();
  const called = useRef(false);
  const navigate = useNavigate();
  const type = location.pathname.split("/").slice(-1)[0];
  
  useEffect(() => {
    (async () => {
      if (called.current) return; 
      called.current = true;
      
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/token${
            window.location.search
          }&type=${type}`,
          { withCredentials: true }
        );
        const userDetails: UserDetails = res.data as unknown as UserDetails;
        
        // Update localStorage
        localStorage.setItem("name", userDetails.name);
        localStorage.setItem("email", userDetails.email);
        if(userDetails.picture) {
          localStorage.setItem("picture", userDetails.picture);
        }
        localStorage.setItem("accessToken", userDetails.accessToken);
        
        // Navigate to home page
        navigate("/", { replace: true });
      } catch (err) {
        console.error(err);
        
        // Check if it's a 404 error (account not found)
        if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response && err.response.status === 404) {
          toast.error("Account not found. Please sign up to create a new account.");
          navigate(`/auth/${type}`, { replace: true });
        } else {
          let errorMessage = 'Unknown error occurred';
          if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
            errorMessage = String(err.response.data.message);
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }
          toast.error(`Authentication failed. Please try again. ${errorMessage}`);
          navigate(`/auth/${type}`, { replace: true });
        }
      }
    })();
  }, [navigate, type]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-75">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
}
