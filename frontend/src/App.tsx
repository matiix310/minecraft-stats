import "./App.css";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import ActivePlayersChart from "./components/ActivePlayersChart";
import ConnectedPlayers from "./components/ConnectedPlayers/ConnectedPlayers";
import PlayersPlayTime from "./components/PlayersPlaytime";
import { CountryData, PlayerData, getCountries, getPlayers } from "./db";
import { useEffect, useState } from "react";
import CountriesPlayTime from "./components/CountriesPlaytime";
import Members from "./components/Members/Members";
import ServerStatus from "./components/ServerStatus/ServerStatus";

Chart.register(CategoryScale);
Chart.defaults.color = "#ffffff";
Chart.defaults.datasets.pie.hoverBackgroundColor = "#00000040";

function App() {
  const [countriesData, setCountriesData] = useState<CountryData[]>();
  const [playersData, setPlayersData] = useState<PlayerData[]>();

  useEffect(() => {
    getCountries().then((data) => {
      setCountriesData(data);
    });
    getPlayers().then(setPlayersData);
  }, []);

  return (
    <div className="App">
      <div className="bentoContainer">
        {/* Active players */}
        <div className="bento">
          <h1 className="title">Active players</h1>
          <div className="chartContainer">
            <ActivePlayersChart />
          </div>
        </div>
        {/* Members */}
        <div className="bento">
          {playersData && <Members playersData={playersData} />}
        </div>
        {/* Server status */}
        <div className="bento">
          <ServerStatus />
        </div>
        {/* Player list */}
        <div className="bento">
          <h1 className="title">Connected players</h1>
          <div className="connectedPlayersContainer">
            {countriesData && playersData && (
              <ConnectedPlayers
                countriesData={countriesData!}
                playersData={playersData!}
              />
            )}
          </div>
        </div>
        {/* Players playtime */}
        <div className="bento">
          <h1 className="title">Players playtime</h1>
          <div className="chartContainer">
            {playersData && <PlayersPlayTime playersData={playersData} />}
          </div>
        </div>
        {/* Countries playtime */}
        <div className="bento">
          <h1 className="title">Countries playtime</h1>
          <div className="chartContainer">
            {countriesData && playersData && (
              <CountriesPlayTime
                countriesData={countriesData}
                playersData={playersData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
