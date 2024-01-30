import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import ActivePlayersChart from "./components/ActivePlayersChart";
import ConnectedPlayers from "./components/ConnectedPlayers/ConnectedPlayers";
import PlayersPlayTime from "./components/PlayersPlaytime";
import { useContext } from "react";
import CountriesPlayTime from "./components/CountriesPlaytime";
import Members from "./components/Members/Members";
import ServerStatus from "./components/ServerStatus/ServerStatus";

import "./index.css";
import { DbContext } from "..";

Chart.register(CategoryScale);
Chart.defaults.color = "#ffffff";
Chart.defaults.datasets.pie.hoverBackgroundColor = "#00000040";

function Home() {
  const { countriesData, playersData } = useContext(DbContext);

  return (
    <div className="Home">
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
          <Members />
        </div>
        {/* Server status */}
        <div className="bento">
          <ServerStatus />
        </div>
        {/* Player list */}
        <div className="bento">
          <h1 className="title">Connected players</h1>
          <div className="connectedPlayersContainer">
            {countriesData && playersData && <ConnectedPlayers />}
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

export default Home;
