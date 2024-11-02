import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsuarios } from "../../../request/UsuarioApi"; // Importando a função para buscar usuários
import { createDepartamento } from "../../../request/DepartamentoApi"; // Importando a função para criar um departamento
import Layout from "../../layout/Layout";

const NovoDepartamento = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsuarios = await fetchUsuarios(); // Usando a função importada para buscar usuários
        setUsuarios(fetchedUsuarios);
      } catch (error) {
        setError("Erro ao buscar usuários.");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const departamentoData = {
        nome,
        idUsuario,
      };

      await createDepartamento(departamentoData); // Usando a função importada para criar o departamento

      setNome("");
      setIdUsuario("");
      navigate("/configuracoes"); // Redireciona após a criação
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
                      <h1 className="h3 mb-0 text-gray-800">Criar departamento</h1>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            {/* Main page content*/}
            <div className="container-fluid px-4">
              <div className="row gx-4">
                <div className="col-lg-8">
                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header text-gray-900">
                      Nome do departamento
                    </div>

                    <div className="card-body">
                      <input
                        className="form-control border-left-primary"
                        id="postTitleInput"
                        type="text"
                        placeholder="Digite o nome do departamento..."
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header text-gray-900">
                      Usuário responsável pelo departamento
                    </div>
                    <div className="card-body">
                      <select
                        className="form-control border-left-primary"
                        aria-label="Prioridade"
                        value={idUsuario}
                        onChange={(e) => setIdUsuario(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Selecione o usuário responsável
                        </option>
                        {usuarios.map((usuario) => (
                          <option key={usuario.id} value={usuario.id}>
                            {usuario.nome}
                          </option>
                        ))}
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
                        Salvar departamento
                      </button>
                    </div>
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

export default NovoDepartamento;
