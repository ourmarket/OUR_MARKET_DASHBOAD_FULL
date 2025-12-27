import ReactDOM from "react-dom/client";
import "./index.css";

import { HashRouter } from "react-router-dom";
import { MaterialUIControllerProvider } from "./context";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./reduxToolkit/store";
import { ClerkProvider } from "@clerk/clerk-react";
import { esES } from "@clerk/localizations";
import SessionLoader from "pages/auth/SessionLoader";


// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={esES}>
    <Provider store={store}>
      <HashRouter>
        <MaterialUIControllerProvider>
          <SessionLoader>
            <App />
          </SessionLoader>
        </MaterialUIControllerProvider>
      </HashRouter>
    </Provider>
  </ClerkProvider>
);
