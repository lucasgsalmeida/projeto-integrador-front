import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import { createUsuario } from "../../request/UsuarioApi";

const NovoUsuario = () => {
  const [nome, setNome] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [senha, setSenha] = useState([]);
  const [role, setRole] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuarioData = {
        nome,
        usuario,
        senha,
        role
      };

      await createUsuario(usuarioData);

      setNome("");
      setUsuario("");
      setSenha("");
      setRole("");
      navigate("/configuracoes");
    } catch (error) {
      console.error("Erro ao criar departamento:", error);
      alert("Erro ao criar departamento");
    }
  };

  return (
    <Layout>
      <div id="layoutSidenav_content">
        <main>
          <form onSubmit={handleSubmit}>
            <header className="page-header page-header-compact page-header-light border-bottom mb-4">
              <div className="container-fluid px-4">
                <div className="page-header-content">
                  <div className="row align-items-center justify-content-between pt-3">
                    <div className="col-auto mb-3">
                      <h1 className="h3 mb-0 text-gray-800">Criar usuário</h1>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div className="container-fluid px-4">
              <div className="row justify-content-baseline m-0">
                <div className="mb-4 border-left-primary shadow py-2 mb-2 w-100 h-100">
                  <div className="card-header text-gray-900">
                    Nome do usuário
                  </div>

                  <div className="card-body">
                    <input
                      className="form-control border-left-primary"
                      id="postTitleInput"
                      type="text"
                      placeholder="Digite o nome do usuário..."
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row justify-content-baseline m-0">
                <div className="mb-4 border-left-primary shadow py-2 mb-2 w-100 h-100">
                  <div className="card-header text-gray-900">
                    Email do usuário
                  </div>

                  <div className="card-body">
                    <input
                      className="form-control border-left-primary"
                      id="postTitleInput"
                      type="email"
                      placeholder="Digite o email do usuário..."
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row justify-content-baseline m-0">
                <div className="mb-4 border-left-primary shadow py-2 mb-2 w-100 h-100">
                  <div className="card-header text-gray-900">
                    Senha do usuário
                  </div>

                  <div className="card-body">
                    <input
                      className="form-control border-left-primary"
                      id="postTitleInput"
                      type="password"
                      placeholder="Digite a senha do usuário..."
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="row justify-content-baseline m-0">
                <div className="mb-4 border-left-primary shadow py-2 mb-2 w-100 h-100">
                  <div className="card-header text-gray-900">
                    Permissão
                  </div>

                  <div className="card-body">
                  <select
                          className="form-control border-left-primary"
                          aria-label="Permissão"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          required
                        >
                          <option value="" disabled>
                            Selecione a permissão
                          </option>
                          <option value="USER">Usuário</option>
                          <option value="ADMIN">Administrador</option>
                        </select>

                  </div>
                </div>
              </div>



              <div className="mb-4 border-left-primary shadow pr-4">
                <div className="card-header">
                  Publicar
                  <i
                    className="text-muted"
                    data-feather="info"
                    data-bs-toggle="tooltip"
                    data-bs-placement="left"
                    title=""
                  />
                </div>

                <div className="card-body">
                  <div className="d-grid">
                    <button className="btn btn-primary" type="submit">
                      Salvar usuário
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
};

export default NovoUsuario;
