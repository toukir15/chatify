import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import ChatPage from "./pages/ChatPage.jsx";
import { store } from "./redux/store.js";

export default function App() {
  return (
    <div>
      <Provider store={store}>
        <ChatPage />
      </Provider>
      <RouterProvider />
    </div>
  );
}
