import React from "react";
import Layout from "../../layout/Layout";
import ListMinhasTarefas from "../../../components/tarefas/ListMinhasTarefas";

const MinhasTarefas = (tipo) => {

  const tipoConsulta = tipo.tipo

  return (
    <Layout>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        {tipoConsulta === "todas" ? (
          <h1 className="h3 mb-0 text-gray-800">Minhas tarefas</h1>
        ) : (
          <h1 className="h3 mb-0 text-gray-800">Tarefas para aprovação</h1>
        )}
      </div>
      <div className="">
        <ListMinhasTarefas tipo={tipoConsulta} />
      </div>
    </Layout>
  );
};

export default MinhasTarefas;
