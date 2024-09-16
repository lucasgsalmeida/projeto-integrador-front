import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import imgSistema from "../../imgs/logo-branca.png";

const Sidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <a className="sidebar-brand d-flex align-items-center justify-content-center">
        <div className="sidebar-brand-icon">
          <img src={imgSistema} className="igmSistema" />
        </div>
        <div className="sidebar-brand-text mx-3">Gestão 10X</div>
      </a>
      <hr className="sidebar-divider my-0" />

      <li className={`nav-item ${activeItem === "/home" ? "active" : ""}`}>
        <a
          className="nav-link"
          href="/home"
          onClick={() => handleItemClick("/home")}
        >
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Dashboard</span>
        </a>
      </li>
      <hr className="sidebar-divider my-0" />

      <li className={`nav-item ${activeItem === "/projetos" ? "active" : ""}`}>
        <a
          className="nav-link"
          href="/projetos"
          onClick={() => handleItemClick("/projetos")}
        >
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Projetos</span>
        </a>
      </li>
      <hr className="sidebar-divider my-0" />

      <li
        className={`nav-item ${
          activeItem === "/departamentos" ? "active" : ""
        }`}
      >
        <a
          className="nav-link"
          href="/departamentos"
          onClick={() => handleItemClick("/departamentos")}
        >
          <i className="fas fa-fw fa-tachometer-alt" />
          <span>Departamentos</span>
        </a>
      </li>
      <hr className="sidebar-divider my-0" />

      <hr className="sidebar-divider my-0" />

      <li className={`nav-item ${activeItem === "/tarefas" ? "active" : ""}`}>
        <a
          className="nav-link"
          href="/tarefas/list"
          data-toggle="collapse"
          data-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          <i className="fas fa-fw fa-cog" />
          <span>Tarefas</span>
        </a>
        <div
          id="collapseTwo"
          className="collapse show"
          aria-labelledby="headingTwo"
          data-parent="#accordionSidebar"
          style={{}}
        >
          <div className="bg-white py-2 collapse-inner rounded">
            <a className="collapse-item" href="/tarefas/list">
              Lista de tarefas
            </a>
            <a className="collapse-item" href="/tarefas/minhas-tarefas">
              Minhas tarefas
            </a>
            <a className="collapse-item" href="/tarefas/modelo">
              Modelo de tarefas
            </a>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default Sidebar;
