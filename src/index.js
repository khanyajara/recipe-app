// index.js or App.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./usercontext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <UserProvider>
        <App />
    </UserProvider>
);
