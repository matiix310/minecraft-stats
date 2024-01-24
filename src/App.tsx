import React, { useEffect, useState } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import { CategoryScale, ChartArea, ChartData, Point } from "chart.js";
import { getActivePlayers } from "./db";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);
Chart.defaults.color = "#ffffff";

function App() {
  var style = getComputedStyle(document.body);

  const defaultActivePlayersData: ChartData<"line", (number | Point | null)[], unknown> =
    {
      labels: ["01/02", "02/02", "03/02"],
      datasets: [
        {
          label: "My First Dataset",
          data: [],
          fill: true,
          backgroundColor: "rgba(255, 255, 255)",
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  const [activePlayersData, setActivePlayersData] = useState(defaultActivePlayersData);

  const defaultActivePlayersOptions: any = {
    animation: false,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          color: style.getPropertyValue("--background") + "50",
        },
      },
      y: {
        min: 0,
        grid: {
          color: style.getPropertyValue("--background") + "50",
        },
      },
    },
  };

  useEffect(() => {
    const mainColor = style.getPropertyValue("--background");
    Chart.defaults.color = mainColor;

    getActivePlayers().then((data): void => {
      setActivePlayersData({
        labels: data.map((d) => d.day),
        datasets: [
          {
            label: "Online players",
            data: data.map((d) => d.value),
            fill: true,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;

              if (!chartArea) {
                // This case happens on initial chart load
                return;
              }
              return getGradient(ctx, chartArea, mainColor);
            },
            borderColor: mainColor,
            tension: 0.1,
          },
        ],
      });
    });
  }, [style]);

  return (
    <div className="App">
      <div className="bentoContainer">
        {/* Active players */}
        <div className="bento">
          <h1 className="title">Active players</h1>
          <div className="chartContainer">
            <Line data={activePlayersData} options={defaultActivePlayersOptions} />
          </div>
        </div>
        {/* Members */}
        <div className="bento"></div>
        {/* Server status */}
        <div className="bento"></div>
        {/* Player list */}
        <div className="bento">
          <h1 className="title">Player list</h1>
        </div>
        {/* Players playtime */}
        <div className="bento">
          <h1 className="title">Players playtime</h1>
        </div>
        {/* Countries playtime */}
        <div className="bento">
          <h1 className="title">Countries playtime</h1>
        </div>
      </div>
    </div>
  );
}

let width: number, height: number, gradient: CanvasGradient;
function getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea, color: string) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(1, color);
    gradient.addColorStop(0, "#ffffff00");
  }

  return gradient;
}

export default App;
