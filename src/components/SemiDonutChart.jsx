import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const SemiDonutChart = ({ value, color = "#0a65cc" }) => {
  const data = {
    labels: ["Progress", "Remaining"],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: [color, "#ddd"],
        borderWidth: 0,
        cutout: "95%",
        rotation: -90,
        circumference: 180,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Box style={{ width: "100%", height: "200px" }}>
      <Doughnut data={data} options={options} />
    </Box>
  );
};

export default SemiDonutChart;
