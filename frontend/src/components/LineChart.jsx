import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, defaults } from "chart.js/auto";
import axios from "axios";
import { useState, useEffect } from "react";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const LineChart = ({ teamId, seasonId }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
            `http://127.0.0.1:8000/api/scores/seasons/${seasonId}/teams/${teamId}`
        );

        // Aggregate scores by month
        const scoresByMonth = response.data.scores.reduce((acc, event) => {
          const date = new Date(event.quiz_event_start_date_time);
          const month = date.toLocaleDateString(undefined, { month: "long" });

          acc[month] = (acc[month] || 0) + event.score;
          return acc;
        }, {});

        const formattedData = {
          labels: Object.keys(scoresByMonth),
          datasets: [
            {
              label: "Total Scores",
              data: Object.values(scoresByMonth),
              borderColor: "rgba(3,105,161,1)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(3,105,161,1)",
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        };

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [teamId, seasonId]); // Update the chart when teamId or seasonId changes

  return (
    <div className="mt-4">
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p className="text-lg">
          No scores available for the selected team and season.
        </p>
      )}
    </div>
  );
};

export default LineChart;