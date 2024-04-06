import { useContext } from "react";
import "./App.css";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import Timeline from "./pages/timeline/Timeline";
import Profile from "./pages/profile/Profile";
import HomePage from "./pages/home/Home";

function App() {
  const { user } = useContext(AuthContext);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {user ? (
          <Route path="/" element={<HomePage />}>
            <Route path="/" element={<Timeline />} />
            <Route path="chats" element={<Messenger />} />
            <Route path="profile/:username" element={<Profile />} />
          </Route>
        ) : (
          <Route path="/*" element={<Register />} />
        )}
        <Route path="login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
      </>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
