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
  const [totalEntry, setTotalEntry] = useState(0);
  const [sortedData, setSortedData] = useState([])

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

      const sorted = res.data.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setSortedData(sorted);
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
      <p>--------------------------------------------</p>
      <div>
      <h2>Daily Report</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Income</th>
            <th>Expense</th>
            <th>Profit</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((r, index) => {
            const income = r.cash + r.upi + r.paytm + r.expense;
            const profit = income - r.expense;

            return (
              <tr key={index}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>₹{income}</td>
                <td>₹{r.expense}</td>
                <td>₹{profit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
