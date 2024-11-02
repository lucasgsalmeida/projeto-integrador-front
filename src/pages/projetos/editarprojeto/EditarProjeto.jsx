import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchUsuarios } from "../../../request/UsuarioApi"; // Importando a função de buscar usuários
import { fetchDepartamentos } from "../../../request/DepartamentoApi"; // Importando a função de buscar departamentos
import {
  fetchProjetoById,
  atualizarProjeto,
  deleteProjeto
} from "../../../request/ProjetoApi"; // Importando funções para buscar e atualizar projeto
import Layout from "../../layout/Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Importar o estilo padrão

const EditarProjeto = () => {
  // Dentro do componente EditarProjeto
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [tipoServico, setTipoServico] = useState("");
  const [orcamentoMensal, setOrcamentoMensal] = useState("0,00");
  const [observacao, setObservacao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [responsaveisDepartamentos, setResponsaveisDepartamentos] = useState(
    []
  );

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "link",
    "list",
    "bullet",
    "indent",
  ];

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Date.UTC(year, month - 1, day));
    const formattedDay = (`0${date.getUTCDate()}`).slice(-2);
    const formattedMonth = (`0${date.getUTCMonth() + 1}`).slice(-2);
    const formattedYear = date.getUTCFullYear();
    return `${formattedDay}/${formattedMonth}/${formattedYear}`; // Formato DD/MM/YYYY
  };

  const formatDateToLocal = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date;
  };


  useEffect(() => {
    const fetchData = async () => {
      console.log(id);
      try {
        const fetchedUsuarios = await fetchUsuarios();
        setUsuarios(fetchedUsuarios);

        const fetchedDepartamentos = await fetchDepartamentos();
        setDepartamentos(fetchedDepartamentos);

        if (id) {
          try {
            const projeto = await fetchProjetoById(id);
            console.log(projeto);
            if (projeto) {
              setNome(projeto.nome);
              setStatus(projeto.status);
              setPrioridade(projeto.prioridade);
              setTipoServico(projeto.tipoServico);
              setOrcamentoMensal(projeto.orcamentoMensal);
              setObservacao(projeto.observacao);
              setDataInicio(projeto.dataInicio);
              setResponsaveisDepartamentos(projeto.rdp || []);
            } else {
              setError("URL inválido");
            }
          } catch (fetchError) {
            setError("Erro ao buscar o projeto.");
            console.error(fetchError);
          }
        }
      } catch (error) {
        setError("Erro ao buscar dados.");
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const formatCurrency = (value) => {
    // Remove qualquer caractere não numérico
    const numericValue = value.replace(/\D/g, "");
    // Converte para formato de centavos e formata com vírgula
    const formattedValue = (parseInt(numericValue, 10) / 100)
      .toFixed(2)
      .replace(".", ",");
    return `R$ ${formattedValue}`;
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "");
    const formattedValue = formatCurrency(numericValue);
    setOrcamentoMensal(formattedValue);
  };

  const handleDelete = async () => {
    try {
      await deleteProjeto(id); // Chama a função para deletar o departamento
      navigate("/projetos"); // Redireciona após a exclusão
    } catch (error) {
      console.error("Erro ao deletar projeto:", error);
      alert("Erro ao deletar projeto");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projetoData = {
        nome,
        status,
        prioridade,
        tipoServico,
        rdp: responsaveisDepartamentos,
        dataInicio: formatDateToLocal(dataInicio),
        orcamentoMensal,
        observacao,
      };

      console.log(projetoData)
      await atualizarProjeto(id, projetoData);

      setNome("");
      setStatus("");
      setPrioridade("");
      setTipoServico("");
      setOrcamentoMensal("");
      setObservacao("");
      setDataInicio("");
      setResponsaveisDepartamentos([]);

      // Redirecionar para a página de projetos
      navigate("/projetos");
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      alert("Erro ao atualizar projeto");
    }
  };

  const handleResponsavelDepartamentoChange = (index, field, value) => {
    const newResponsaveis = [...responsaveisDepartamentos];
    newResponsaveis[index][field] = value;
    setResponsaveisDepartamentos(newResponsaveis);
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

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
                      <h1 className="h3 mb-0 text-gray-800">Editar projeto</h1>
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
                      Nome do projeto
                    </div>

                    <div className="card-body">
                      <input
                        className="form-control border-left-primary"
                        id="postTitleInput"
                        type="text"
                        placeholder="Digite o nome do projeto..."
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-4 border-left-primary shadow py-2 mb-2">
                        <div className="card-header text-gray-900">
                          Status do projeto
                        </div>
                        <div className="card-body">
                          <select
                            className="form-control border-left-primary"
                            aria-label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                          >
                            <option value="" disabled>
                              Selecione o status
                            </option>
                            <option value="ATIVO">Ativo</option>
                            <option value="PAUSADO">Pausado</option>
                            <option value="ENCERRAMENTO">Encerramento</option>
                            <option value="ENCERRADO">Encerrado</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-4 border-left-primary shadow py-2 mb-2">
                        <div className="card-header text-gray-900">
                          Tipo de serviço
                        </div>
                        <div className="card-body">
                          <select
                            className="form-control border-left-primary"
                            aria-label="Tipo de serviço"
                            value={tipoServico}
                            onChange={(e) => setTipoServico(e.target.value)}
                            required
                          >
                            <option value="" disabled>
                              Selecione o tipo de serviço
                            </option>
                            <option value="TRAFEGO">Tráfego</option>
                            <option value="SOCIAL_MEDIA">Social Media</option>
                            <option value="TRAFEGO_SOCIAL_MEDIA">
                              Tráfego & Social Media
                            </option>
                            <option value="AUTOMACAO">Automação</option>
                            <option value="OUTROS">Outros</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-4 border-left-primary shadow py-2 mb-2">
                        <div className="card-header text-gray-900">
                          Selecione a prioridade
                        </div>
                        <div className="card-body">
                          <select
                            className="form-control border-left-primary"
                            aria-label="Prioridade"
                            value={prioridade}
                            onChange={(e) => setPrioridade(e.target.value)}
                            required
                          >
                            <option value="" disabled>
                              Selecione a prioridade
                            </option>
                            <option value="MUITO_ALTO">Muito Alto</option>
                            <option value="ALTO">Alto</option>
                            <option value="MEDIO">Médio</option>
                            <option value="BAIXO">Baixo</option>
                            <option value="MUITO_BAIXO">Muito Baixo</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-4 border-left-primary shadow py-2 mb-2">
                        <div className="card-header text-gray-900">
                          Orçamento mensal
                        </div>
                        <div className="card-body">
                          <input
                            className="form-control border-left-primary"
                            id="postTitleInput"
                            type="text"
                            placeholder="Digite o orçamento mensal..."
                            value={orcamentoMensal}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {departamentos.length > 0 && (

                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header text-gray-900">
                      Responsável por departamento
                    </div>
                    <div className="card-body">
                      {departamentos.map((departamento, index) => (
                        <div key={departamento.id} className="shadow py-2 mb-2">
                          <div className="card-header text-gray-900">
                            <strong>Departamento:</strong> {departamento.nome}
                          </div>
                          <div className="card-body mb-2">
                            <div className="form-group mb-2">
                              <label htmlFor={`responsavel-${departamento.id}`}>
                                Responsável por departamento
                              </label>
                              <select
                                className="form-control border-left-primary"
                                id={`responsavel-${departamento.id}`}
                                value={
                                  responsaveisDepartamentos[index]?.idUsuario ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleResponsavelDepartamentoChange(
                                    index,
                                    "idUsuario",
                                    e.target.value
                                  )
                                }
                                required
                              >
                                <option value="" disabled>
                                  Selecione um responsável
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
                      ))}
                    </div>
                  </div>
                  )}

                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header text-gray-900">
                      Notas sobre o projeto
                    </div>
                    <div className="card-body">
                      <ReactQuill
                        value={observacao}
                        onChange={(content, delta, source, editor) =>
                          setObservacao(content)
                        }
                        modules={modules}
                        formats={formats}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header text-gray-900">
                      Data de início do projeto
                    </div>
                    <div className="card-body">
                      <input
                        className="form-control border-left-primary"
                        id="postTitleInput"
                        type="date"
                        placeholder="Digite a data de início do projeto..."
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header">
                      Publicar
                      <i
                        className="text-muted"
                        data-feather="info"
                        data-bs-toggle="tooltip"
                        data-bs-placement="left"
                        title="After submitting, your post will be published once it is approved by a moderator."
                      />
                    </div>

                    <div className="card-body">
                      <div className="d-grid">
                        <button
                          className="fw-500 btn btn-warning text-gray-900 mr-2"
                          type="submit"
                        >
                          Editar projeto
                        </button>
                        <button
                          className="fw-500 btn btn-danger ml-2"
                          type="button"
                          onClick={handleDelete}
                        >
                          Excluir projeto
                        </button>
                      </div>{" "}
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

export default EditarProjeto;
