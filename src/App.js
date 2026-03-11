import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseProfitChart = () => {
  const [chartData, setChartData] = useState({
    expense: 0,
    profit: 0
  });
  const [totalEntry, setTotalEntry] = useState(0)

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("http://localhost:5000/daily-record");

      const records = res.data && res.data.data;

      let totalIncome = 0;
      let totalExpense = 0;

      records && records.forEach((item) => {
        const income = item.cash + item.upi + item.paytm + item.expense;
        totalIncome += income;
        totalExpense += item.expense;
      });

      const profit = totalIncome - totalExpense;
      setTotalEntry(records.length)
      setChartData({
        expense: totalExpense,
        profit: profit
      });
    } catch (error) {
      console.error(error);
    }
  };

  const data = {
    labels: ["Profit", "Expense"],
    datasets: [
      {
        data: [ chartData.profit, chartData.expense],
        backgroundColor: ["#00ff00", "#ff6384"]
      }
    ]
  };
const Total = chartData.expense + chartData.profit
  return (
    <div style={{ width: "400px", margin: "auto" }}>
      <h2>Hari OM Vinayak Restaurent report</h2>
      <h2>Total sales: {Total} </h2>
      <h2>Total expense: {chartData.expense }</h2>
      <h2>Net profit: {chartData.profit}</h2>
      <h2>Profit margin {((chartData.profit/Total) * 100).toFixed(2)}</h2>
      <Pie data={data} />

      <h2>Total entries: {totalEntry} </h2>
      <h2>Average Sale per day: {(Total / totalEntry).toFixed(2)} </h2>
      <h2>Average Expense per day: {(chartData.expense / totalEntry).toFixed(2)} </h2>
      <h2>Average Profit per day: {(chartData.profit / totalEntry).toFixed(2)} </h2>
    </div>
  );
};


function App() {

  return (
    <div className="App">
      <ExpenseProfitChart/>
    </div>
  );
}

export default App;
