import { createBrowserRouter } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import LoginPage from "../AuthenticationPage/LoginPage";
import SignUpPage from "../AuthenticationPage/SignUpPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><ChatPage/></ProtectedRoute> ,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
]);
