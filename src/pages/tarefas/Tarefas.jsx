import React from "react";
import Layout from "../layout/Layout";
import ListTarefas from "../../components/tarefas/ListTarefas";

const Tarefas = (tipo) => {
  const tipoConsulta = tipo.tipo

  return (
    <Layout>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        {tipoConsulta === "todas" ? (
        <h1 className="h3 mb-0 text-gray-800">Todas as tarefas</h1>
        ) : (
          <h1 className="h3 mb-0 text-gray-800">Arquivo de tarefas</h1>
        )}
        {tipoConsulta === "todas" && (
        <a href="/tarefas/nova" className="btn btn-primary btn-icon-split shadow">
          <span className="icon text-white-50">
            <i className="fas fa-plus" />
          </span>
          <span className="text">Nova Tarefa</span>
        </a>
        )}
      </div>
      <div className="">
        <ListTarefas tipo={tipoConsulta}/>
      </div>
    </Layout>
  );
};

export default Tarefas;
