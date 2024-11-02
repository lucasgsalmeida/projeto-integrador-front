import React from "react";
import Layout from "../layout/Layout";
import ListTipoTarefa from "../../components/tipoTarefa/ListTipoTarefa";

const TipoTarefa = () => {
  return (
  <Layout>
    <div className="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 className="h3 mb-0 text-gray-800">Modelo de tarefa</h1>
      <a href="/tarefas/modelo/novo" className="btn btn-primary btn-icon-split shadow">
        <span className="icon text-white-50">
          <i className="fas fa-plus" />
        </span>
        <span className="text">Novo modelo</span>
      </a>
    </div>
    <div className="border-left-primary shadow h-100 py-2 mb-5">
      <div className="input-group">
        <input
          type="text"
          className="form-control bg-light border-0 small"
          placeholder="Nome do modelo"
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
      <ListTipoTarefa />
    </div>
  </Layout>
)};

export default TipoTarefa;
