import React, { useState } from 'react';
import Layout from '../layout/Layout';
import Departamentos from '../departamento/Departamento';
import Escritorio from './Escritorio';
import Usuario from './Usuario';

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState('escritorio'); // Estado para controlar a aba ativa

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Atualiza a aba ativa
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'escritorio':
        return <Escritorio />;
      case 'usuarios':
        return <Usuario />;
      case 'departamentos':
        return <Departamentos />;
      default:
        return <Escritorio />;
    }
  };

  return (
    <Layout>
      <ul className="nav nav-pills bg-white rounded shadow mb-5 border-dark">
        <li className="nav-item border-dark">
          <a
            href="#"
            className={`nav-link ${activeTab === 'escritorio' ? 'active text-white' : 'text-dark'}`}
            onClick={() => handleTabClick('escritorio')}
          >
            Escritório
          </a>
        </li>
        <li className="nav-item border-white">
          <a
            href="#"
            className={`nav-link ${activeTab === 'usuarios' ? 'active text-white' : 'text-dark'}`}
            onClick={() => handleTabClick('usuarios')}
          >
            Usuários
          </a>
        </li>
        <li className="nav-item border-white">
          <a
            href="#"
            className={`nav-link ${activeTab === 'departamentos' ? 'active text-white' : 'text-dark'}`}
            onClick={() => handleTabClick('departamentos')} // Atualiza a aba ativa sem navegação
          >
            Departamentos
          </a>
        </li>
      </ul>

      {renderTabContent()} {/* Renderiza o conteúdo da aba ativa */}
    </Layout>
  );
};

export default Configuracoes;
