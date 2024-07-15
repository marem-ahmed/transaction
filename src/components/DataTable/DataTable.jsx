import React, { useEffect, useState } from "react";
import mariam from "../../mariam.json";
import style from "./DataTable.modules.css";

export default function DataTable() {
  const [dataCustomers, setDataCustomers] = useState([]);
  const [dataTransactions, setDataTransactions] = useState([]);
  const [mergedData, setMergedData] = useState([]);

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

  const sortByAmount = () => {
    const sortedData = [...mergedData].sort((x, y) => x.amount - y.amount);
    setMergedData(sortedData);
  };
const sortByName = () => {
    const sortedData = [...mergedData].sort((x, y) => x.customer_name.localeCompare(y.customer_name)
    );
        setMergedData(sortedData);
}
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
              <tr key={ele.id}>
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
          <button className="btn btn-primary ms-3 px-5 py-2" onClick={sortByName}>
            Sort by Name
          </button>
        </div>
      </div>
    </div>
  );
}
