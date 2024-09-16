import React from "react";
import Layout from "../layout/Layout";
import ListTarefas from "../../components/tarefas/ListTarefas";

const Tarefas = () => {
  return (
    <Layout>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Tarefas</h1>
        <a href="/tarefas/nova" className="btn btn-primary btn-icon-split shadow">
          <span className="icon text-white-50">
            <i className="fas fa-plus" />
          </span>
          <span className="text">Nova Tarefa</span>
        </a>
      </div>
      <div className="border-left-primary shadow h-100 py-2 mb-5">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light border-0 small"
            placeholder="Nome da tarefa, Data de início, Status"
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button">
              <i className="fas fa-search fa-sm" />
            </button>
          </div>
        </div>
      </div>
      <div className="">
        <ListTarefas />
      </div>
    </Layout>
  );
};

export default Tarefas;
