"use client";

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PopulationChart = ({ populationData }) => {
    const labels = populationData.map(item => item.year);
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Population Over Time',
                data: populationData.map(item => item.value),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.4)',
                borderColor: 'rgba(75, 192, 192, 1)',
            }
        ]
    };

    return <Line data={data} width={1600} height={1100} />;
};

export default PopulationChart;