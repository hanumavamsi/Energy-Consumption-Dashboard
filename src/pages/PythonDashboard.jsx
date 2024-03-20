import React, { useEffect,useState } from "react";

// App.js
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function PythonDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Bar Chart',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: data.values,
      },
    ],
  };

  return (
    <div style={{ margin: '50px' }}>
      <h1>Electricity Consumption Prediction</h1>
      <Bar
        data={chartData}
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};


export default PythonDashboard;
