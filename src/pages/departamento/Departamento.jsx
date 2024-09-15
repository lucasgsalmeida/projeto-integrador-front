import React from "react";
import Layout from "../layout/Layout";
import ListDepartamentos from "../../components/departamento/ListDepartamento";

const Departamentos = () => {
  return (
    <>
      <Layout>
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Departamentos</h1>

          <a href="/departamentos/novo" className="btn btn-primary btn-icon-split shadow">
            <span className="icon text-white-50">
              <i className="fas fa-check" />
            </span>
            <span className="text">Novo Departamento</span>
          </a>
        </div>
        <div className="border-left-primary shadow h-100 py-2 mb-5">
          <div className="input-group">
            <input
              type="text"
              className="form-control bg-light border-0 small"
              placeholder="Pesquisar departamento"
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
          <ListDepartamentos />
        </div>
      </Layout>
    </>
  );
};

export default Departamentos;
