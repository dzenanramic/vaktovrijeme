import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ThemeProvider from "./theme/index.tsx";
import store from "./redux/store.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
