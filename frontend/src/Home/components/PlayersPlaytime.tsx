import { Chart, ChartData } from "chart.js";
import { Point } from "chart.js/dist/core/core.controller";
import { useEffect, useState } from "react";
import { PlayerData } from "../../db";
import { Pie } from "react-chartjs-2";

type PlayersPlaytimeData = {
  playersData: PlayerData[];
};

const PlayersPlayTime = ({ playersData }: PlayersPlaytimeData) => {
  var style = getComputedStyle(document.body);
  const mainColor = style.getPropertyValue("--background");

  const defaultPlayersPlaytimeData: ChartData<"pie", (number | Point | null)[], unknown> =
    {
      labels: [],
      datasets: [],
    };
  const [playersPlaytimeData, setPlayersPlaytimeData] = useState(
    defaultPlayersPlaytimeData
  );

  const defaultPlayersPlaytimeOptions: any = {
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    Chart.defaults.color = mainColor;

    setPlayersPlaytimeData({
      labels: playersData.map((playerData) => playerData.name),
      datasets: [
        {
          label: "Playtime (Hour)",
          data: playersData.map(
            (playerData) => Math.floor((100 * playerData.playtime) / 60) / 100
          ),
          borderColor: mainColor,
        },
      ],
    });
  }, [mainColor, playersData]);

  return <Pie data={playersPlaytimeData} options={defaultPlayersPlaytimeOptions} />;
};

export default PlayersPlayTime;
