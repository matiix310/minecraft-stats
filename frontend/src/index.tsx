import React, { Dispatch, useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// styles
import "./index.css";

// Routes
import ErrorPage from "./ErrorPage";
import Home from "./Home";
import Player from "./Players";
import {
  ActivePlayersData,
  ConnectedPlayerData,
  CountryData,
  PlayerData,
  getActivePlayers,
  getConnectedPlayers,
  getCountries,
  getPlayers,
} from "./db";

type ServerQueryData = {
  online: boolean;
  icon: string;
  motd: string;
  fetched: boolean;
};

const initialServerQueryData = {
  online: false,
  icon: "",
  motd: "Pinging, please wait...",
  fetched: false,
};

type playerHead = {
  playerName: string;
  image: string;
};

export const DbContext = React.createContext<{
  countriesData: CountryData[] | undefined;
  playersData: PlayerData[] | undefined;
  activePlayersData: ActivePlayersData[] | undefined;
  connectedPlayersData: ConnectedPlayerData[] | undefined;
  serverQueryData: ServerQueryData;
  setServerQueryData: Dispatch<ServerQueryData>;
  playersHead: playerHead[];
  setPlayersHead: React.Dispatch<React.SetStateAction<playerHead[]>>;
}>({
  countriesData: undefined,
  playersData: undefined,
  activePlayersData: undefined,
  connectedPlayersData: undefined,
  serverQueryData: initialServerQueryData,
  setServerQueryData: () => {},
  playersHead: [],
  setPlayersHead: () => {},
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  const context = useContext(DbContext);

  const [countriesData, setCountriesData] = useState<CountryData[] | undefined>(
    context.countriesData
  );
  const [playersData, setPlayersData] = useState<PlayerData[] | undefined>(
    context.playersData
  );
  const [activePlayersData, setActivePlayersData] = useState<
    ActivePlayersData[] | undefined
  >(context.activePlayersData);
  const [connectedPlayersData, setConnectedPlayersData] = useState<
    ConnectedPlayerData[] | undefined
  >(context.connectedPlayersData);
  const [serverQueryData, setServerQueryData] = useState<ServerQueryData>(
    context.serverQueryData
  );
  const [playersHead, setPlayersHead] = useState<playerHead[]>(context.playersHead);

  useEffect(() => {
    getCountries().then(setCountriesData);
    getPlayers().then(setPlayersData);
    getActivePlayers(7).then(setActivePlayersData);
  }, []);

  useEffect(() => {
    if (countriesData && playersData)
      getConnectedPlayers(countriesData, playersData).then(setConnectedPlayersData);
  }, [countriesData, playersData]);

  return (
    <BrowserRouter>
      <DbContext.Provider
        value={{
          countriesData,
          playersData,
          activePlayersData,
          connectedPlayersData,
          serverQueryData,
          setServerQueryData,
          playersHead,
          setPlayersHead,
        }}
      >
        <Routes>
          <Route path="/" Component={Home} ErrorBoundary={ErrorPage} />
          <Route path="/players/:playerName" Component={Player} />
        </Routes>
      </DbContext.Provider>
    </BrowserRouter>
  );
}
