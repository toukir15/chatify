import { createBrowserRouter } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import LoginPage from "../AuthenticationPage/LoginPage";
import SignUpPage from "../AuthenticationPage/SignUpPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatPage />,
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
