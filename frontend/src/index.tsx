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
  FormatedAdvancement,
  ConnectedPlayerData,
  CountryData,
  PlayerData,
  getActivePlayers,
  getConnectedPlayers,
  getCountries,
  getPlayers,
  Statistics,
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
  advancements: { [uuid: string]: FormatedAdvancement[] };
  setAdvancements: React.Dispatch<
    React.SetStateAction<{
      [uuid: string]: FormatedAdvancement[];
    }>
  >;
  statistics: { [uuid: string]: Statistics };
  setStatistics: React.Dispatch<
    React.SetStateAction<{
      [uuid: string]: Statistics;
    }>
  >;
  playersFullSkin: { [playerName: string]: string };
  setPlayersFullSkin: React.Dispatch<
    React.SetStateAction<{
      [playerName: string]: string;
    }>
  >;
}>({
  countriesData: undefined,
  playersData: undefined,
  activePlayersData: undefined,
  connectedPlayersData: undefined,
  serverQueryData: initialServerQueryData,
  setServerQueryData: () => {},
  playersHead: [],
  setPlayersHead: () => {},
  advancements: {},
  setAdvancements: () => {},
  statistics: {},
  setStatistics: () => {},
  playersFullSkin: {},
  setPlayersFullSkin: () => {},
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
  const [advancements, setAdvancements] = useState<{
    [uuid: string]: FormatedAdvancement[];
  }>(context.advancements);
  const [statistics, setStatistics] = useState<{
    [uuid: string]: Statistics;
  }>(context.statistics);
  const [playersFullSkin, setPlayersFullSkin] = useState<{
    [playerName: string]: string;
  }>(context.playersFullSkin);

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
          advancements,
          setAdvancements,
          statistics,
          setStatistics,
          playersFullSkin,
          setPlayersFullSkin,
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
