import { Chart, ChartData } from "chart.js";
import { Point } from "chart.js/dist/core/core.controller";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { CountryData, PlayerData } from "../db";

type CountriesPlaytimeData = {
  playersData: PlayerData[];
  countriesData: CountryData[];
};

const CountriesPlayTime = ({ playersData, countriesData }: CountriesPlaytimeData) => {
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
      labels: countriesData.map((countryData) => countryData.displayName),
      datasets: [
        {
          label: "Playtime (Hour)",
          data: countriesData.map((countryData) => {
            let playtime = 0;

            for (let player of playersData)
              if (player.countryCode === countryData.countryCode)
                playtime += player.playtime;

            return playtime;
          }),
          borderColor: mainColor,
        },
      ],
    });
  }, [mainColor, countriesData, playersData]);

  return <Pie data={playersPlaytimeData} options={defaultPlayersPlaytimeOptions} />;
};

export default CountriesPlayTime;
