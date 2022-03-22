import "../styles/globals.css";
import AppContext from "./AppContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userHasImpact, setUerHasImpact] = useState(false);
  const [projects, setProjects] = useState([]);

  return (
    <AppContext.Provider
      value={{
        state: {
          isConnected,
          currentAccount,
          accessToken,
          userHasImpact,
          projects,
        },
        setIsConnected,
        setCurrentAccount,
        setAccessToken,
        setUerHasImpact,
        setProjects,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
