import React from 'react'
import Layout from '../../layout/Layout'
import ListParaAprovacao from '../../../components/tarefas/ListParaAprovacao'

const ParaAprovacao = () => {
  return (
    <Layout>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Minhas tarefas</h1>
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
        <ListParaAprovacao />
      </div>
    </Layout>
    )
}

export default ParaAprovacao