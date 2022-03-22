import "../styles/globals.css";
import AppContext from "./AppContext";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [userHasImpact, setUerHasImpact] = useState(false);
  const [projects, setProjects] = useState([]);
  const [userRegistration, setUserRegistration] = useState({
    orgName: "",
    countryName: "",
    description: "",
    LYSamount: 0,
  });

  return (
    <AppContext.Provider
      value={{
        state: {
          isConnected,
          currentAccount,
          accessToken,
          userHasImpact,
          projects,
          userRegistration,
        },
        setIsConnected,
        setCurrentAccount,
        setAccessToken,
        setUerHasImpact,
        setProjects,
        setUserRegistration,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
