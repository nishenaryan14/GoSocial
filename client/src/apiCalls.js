import axios from "axios";
// axios.defaults.headers.common["Accept-Encoding"] = "gzip, deflate";
export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("auth/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

export const logoutCall = async (dispatch) => {
  try {
    await axios.get("/auth/logout");
    dispatch({ type: "LOGOUT" });
  } catch (err) {
    console.error("Error logging out:", err);
  }
};

export const fetchUser = async (userId) => {
  try {
    const res = await axios.get(`/users?userId=${userId}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchPosts = async (username, id) => {
  try {
    const res = username
      ? await axios.get("/posts/profile/" + username)
      : await axios.get("/posts/timeline/" + id);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
