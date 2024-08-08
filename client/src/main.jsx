import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { router } from "./Router/Route.jsx";

import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import "tippy.js/dist/tippy.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
        <Toaster />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
