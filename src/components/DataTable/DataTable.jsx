import React, { useEffect, useState } from "react";
import mariam from "../../mariam.json";
import style from "./DataTable.modules.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";

export default function DataTable() {
  const [dataCustomers, setDataCustomers] = useState([]);
  const [dataTransactions, setDataTransactions] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setDataCustomers(mariam.customers);
    setDataTransactions(mariam.transactions);
  }, []);

  useEffect(() => {
    if (dataCustomers.length > 0 && dataTransactions.length > 0) {
      const customerTotal = dataCustomers.reduce((total, customer) => {
        total[customer.id] = customer.name;
        return total;
      }, {});

      const mergedApi = dataTransactions.map((transaction) => ({
        ...transaction,
        customer_name: customerTotal[transaction.customer_id],
      }));

      setMergedData(mergedApi);
    }
  }, [dataCustomers, dataTransactions]);

  useEffect(() => {
    if (selectedCustomer) {
      const filterData = dataTransactions.filter(
        (ele) => ele.customer_id === selectedCustomer.id
      );

      const totalData = Object.values(
        filterData.reduce((combine, { date, amount }) => {
          combine[date] = combine[date] || { date, amount: 0 };
          combine[date].amount += amount;
          return combine;
        }, {})
      );

      setChartData(totalData);
    }
  }, [selectedCustomer, dataTransactions]);

  const sortByAmount = () => {
    const sortedData = [...mergedData].sort((x, y) => x.amount - y.amount);
    setMergedData(sortedData);
  };

  const sortByName = () => {
    const sortedData = [...mergedData].sort((x, y) =>
      x.customer_name.localeCompare(y.customer_name)
    );
    setMergedData(sortedData);
  };

  return (
    <div>
      <h1 className="text-center">Customers and Transaction List</h1>

      <div className="table-box mx-auto">
        <table className="table-content">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {mergedData.map((ele) => (
              <tr key={ele.id} onClick={() => setSelectedCustomer(ele)}>
                <td>{ele.id}</td>
                <td>{ele.customer_name}</td>
                <td>{ele.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex align-self-start justify-content-between btns">
          <button className="btn btn-primary px-5 py-2" onClick={sortByAmount}>
            Sort by Amount
          </button>
          <button
            className="btn btn-primary ms-3 px-5 py-2"
            onClick={sortByName}
          >
            Sort by Name
          </button>
        </div>
      </div>

      {selectedCustomer && (
        <div className="chart-container">
          <h2 className="text-center">
            Transaction Amounts for {selectedCustomer.customer_name}
          </h2>
          <ResponsiveContainer height={400} className="mx-auto w-75">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Bar
                yAxisId="right"
                dataKey="amount"
                barSize={20}
                fill="#413ea0"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
