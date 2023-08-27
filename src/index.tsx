import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ComingSoon from "./pages/404";
import FormUI from "./form/formUI";
import DataDisplayTable from "./form/DataDisplayTable";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ComingSoon />,
  },
  {
    path: "/signup",
    element: <ComingSoon />,
    errorElement: <ComingSoon />,
  },
  {
    path: "form",
    element: <FormUI />,
  },
  {
    path: "table",
    element: <DataDisplayTable />,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
