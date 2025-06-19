import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Loader from "./Loader";
import useRefreshToken from "../../hooks/useRefreshToken";

export default function PersistentLogin() {
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      setLoading(true);
      try {
        await refresh();
      } catch (err) {
        console.log(err);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    // Only call refresh if not on an /auth route
    const isAuthRoute = location.pathname.includes('/auth');
    console.log('isAuthRoute',location.pathname,isAuthRoute);
    if ((!accessToken || accessToken.length === 0) && !isAuthRoute) {
      verifyRefreshToken();
    } else {
      setLoading(false);
    }
  }, [accessToken, refresh, location.pathname]);

  return (
    <>
      {loading ? <Loader /> : <Outlet />}
    </>
  );
}
