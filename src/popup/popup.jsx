import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import App from "./components/App";

const Popup = () => {
  return <App />;
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(React.createElement(Popup, null));
