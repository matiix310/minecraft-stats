import { Chart, ChartArea, ChartData } from "chart.js";
import { Point } from "chart.js/dist/core/core.controller";
import { useEffect, useState } from "react";
import { getActivePlayers } from "../db";
import { Line } from "react-chartjs-2";

const ActivePlayersChart = () => {
  var style = getComputedStyle(document.body);
  const mainColor = style.getPropertyValue("--background");
  Chart.defaults.color = mainColor;

  const defaultActivePlayersData: ChartData<"line", (number | Point | null)[], unknown> =
    {
      labels: [],
      datasets: [],
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
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    getActivePlayers(7).then((data): void => {
      setActivePlayersData({
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "Online players",
            data: data.map((d) => d.playerCount),
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
  }, [mainColor]);

  return <Line data={activePlayersData} options={defaultActivePlayersOptions} />;
};

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

export default ActivePlayersChart;
