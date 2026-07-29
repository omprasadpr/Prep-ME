import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "260805826771-gss7qvg8og4i54cf9rviqbv28lbh35tv.apps.googleusercontent.com";

console.log("Google Client ID:", googleClientId);

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </GoogleOAuthProvider>
);