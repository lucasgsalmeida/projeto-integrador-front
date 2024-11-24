import React from "react";
import Layout from "../layout/Layout";
import ParaHoje from "./Vencimentos";
import Kanban from "./Kanban";
import { useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('vencimentos');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vencimentos':
        return <ParaHoje />;
      case 'tarefas':
        return <Kanban />;
      default:
        return <ParaHoje />;
    }
  };

  return (
    <Layout>
      <ul className="nav nav-pills bg-white rounded shadow mb-5 border-dark">
      <li className="nav-item border-white">
          <a
            href="#"
            className={`nav-link ${activeTab === 'vencimentos' ? 'active text-white' : 'text-dark'}`}
            onClick={() => handleTabClick('vencimentos')}
          >
            Resumo de vencimentos
          </a>
        </li>
        <li className="nav-item border-dark">
          <a
            href="#"
            className={`nav-link ${activeTab === 'tarefas' ? 'active text-white' : 'text-dark'}`}
            onClick={() => handleTabClick('tarefas')}
          >
            Status das tarefas
          </a>
        </li>
      </ul>

      {renderTabContent()} {/* Renderiza o conteúdo da aba ativa */}
    </Layout>
  );
};

export default Dashboard;
