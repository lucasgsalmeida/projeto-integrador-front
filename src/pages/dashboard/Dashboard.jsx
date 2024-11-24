import React from "react";
import Layout from "../layout/Layout";
import ParaHoje from "./Vencimentos";

const Dashboard = () => {
  return (
    <>
      <Layout>
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>

        <ParaHoje/>
      </Layout>
    </>
  );
};

export default Dashboard;
