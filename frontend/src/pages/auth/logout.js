import { clearAllCookies } from "../../helpers/cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkLogin } from "../../actions/login";

export const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    clearAllCookies();
    dispatch(checkLogin(false));
    navigate("/login");
  }, [dispatch, navigate]);

  return null;
}