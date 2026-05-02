import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./actions/user";
import { checkLogin } from "./actions/login";
import { getUserInfo } from "./services/usersService";
import { getCookie } from "./helpers/cookie";

export const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initApp = async () => {
      const token = getCookie("token");
      if (token) {
        dispatch(checkLogin(true));
        try {
          const res = await getUserInfo();
          if (res?.code === 200) {
            dispatch(setUser(res.data));
          } else {
            // Token might be invalid
            dispatch(checkLogin(false));
            dispatch(setUser(null));
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);
          dispatch(checkLogin(false));
        }
      } else {
        dispatch(checkLogin(false));
      }
    };

    initApp();
  }, [dispatch]);

  return children;
};
