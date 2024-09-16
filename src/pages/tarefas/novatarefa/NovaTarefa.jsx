import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProjetos, fetchProjetoById } from "../../../request/ProjetoApi";
import { fetchTipoTarefas } from "../../../request/TipoTarefaApi";
import { fetchUsuarios } from "../../../request/UsuarioApi";
import { fetchDepartamentos } from "../../../request/DepartamentoApi";
import { createTarefa } from "../../../request/TarefaApi";
import Layout from "../../layout/Layout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Importar o estilo padrão
import "./NovaTarefa.css";

const NovaTarefa = () => {
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState([]);
  const [tiposTarefas, setTiposTarefas] = useState([]);
  const [subTarefaList, setSubTarefaList] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [idProjeto, setIdProjeto] = useState("");
  const [idTipoTarefa, setIdTipoTarefa] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [prioridadeTarefa, setPrioridadeTarefa] = useState("MEDIO");
  const [dataInicio, setDataInicio] = useState(
    new Date().toISOString().split("T")[0]
  );

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

  const getNomeDepartamento = (idDepartamento) => {
    const departamento = departamentos.find(
      (departamento) => departamento.id === idDepartamento
    );
    return departamento ? departamento.nome : "Desconhecido";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projetosData, tipoTarefasData, usuariosData, departamentosData] =
          await Promise.all([
            fetchProjetos(),
            fetchTipoTarefas(),
            fetchUsuarios(),
            fetchDepartamentos(),
          ]);

        setProjetos(projetosData);
        setTiposTarefas(tipoTarefasData);
        setUsuarios(usuariosData);
        setDepartamentos(departamentosData);
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      }
    };

    fetchData();
  }, []);

  const calculateDates = (dataInicioTarefa, qtdDias, subTarefaAnterior) => {
    const inicioDate = subTarefaAnterior
      ? new Date(
          new Date(subTarefaAnterior.dataFim).setDate(
            new Date(subTarefaAnterior.dataFim).getDate() + 1
          )
        )
      : new Date(dataInicioTarefa);

    const fimDate = new Date(inicioDate);
    fimDate.setDate(inicioDate.getDate() + qtdDias);

    return {
      dataInicio: inicioDate.toISOString().split("T")[0],
      dataFim: fimDate.toISOString().split("T")[0],
    };
  };

  const handleTipoTarefaChange = async (e) => {
    const modeloId = parseInt(e.target.value, 10);
    setIdTipoTarefa(modeloId); // Atualize o estado idTipoTarefa

    try {
      const tipoTarefa = tiposTarefas.find((t) => t.id === modeloId);

      if (!tipoTarefa) {
        console.error("Tipo de tarefa não encontrado:", modeloId);
        return;
      }

      let dataInicioTarefa = new Date(dataInicio); // Data de início da tarefa
      let novaSubTarefaList = [];

      tipoTarefa.responsavelDepartamentoProjetos.forEach((rdp, index) => {
        const responsavel = rdp.idUsuario
          ? usuarios.find((u) => u.id === rdp.idUsuario)
          : null;
        const departamento = rdp.idDepartamento
          ? departamentos.find((d) => d.id === rdp.idDepartamento)
          : null;

        const { dataInicio, dataFim } = calculateDates(
          dataInicioTarefa,
          rdp.qtdDias,
          novaSubTarefaList[index - 1]
        );

        novaSubTarefaList.push({
          idProjeto,
          idDepartamento: departamento ? departamento.id : null,
          departamentoNome: departamento ? departamento.nome : "Não definido",
          responsavelNome: responsavel ? responsavel.nome : "",
          idUsuario: responsavel ? responsavel.id : null,
          ordem: rdp.ordem,
          dataInicio,
          dataFim,
          statusTarefa: "PARA_FAZER",
        });
      });

      setSubTarefaList(novaSubTarefaList);
      setDescricao(tipoTarefa.descricao);
    } catch (error) {
      console.error("Erro ao buscar dados do tipo de tarefa:", error);
    }
  };

  const handleProjetoChange = async (e) => {
    const projetoId = e.target.value;
    setIdProjeto(projetoId);

    try {
      const projeto = await fetchProjetoById(projetoId);
    } catch (error) {
      console.error("Erro ao buscar dados do projeto:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepara a lista de subtarefas para o envio com IDs
    const formattedSubTarefaList = subTarefaList.map((subTarefa) => ({
      idUsuario: subTarefa.idUsuario,
      idDepartamento: subTarefa.idDepartamento,
      dataInicio: subTarefa.dataInicio,
      dataFim: subTarefa.dataFim,
      status: "PARA_FAZER",
    }));


    try {
      await createTarefa({
        idProjeto,
        id_tipoTarefa: idTipoTarefa,
        subTarefaList: formattedSubTarefaList,
        prioridadeTarefa,
        dataInicio,
        descricao,
        status: "PARA_FAZER",
      });
      navigate("/tarefas/list");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
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
                      <h1 className="h3 mb-0 text-gray-800">Criar Tarefa</h1>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div className="container-fluid px-4">
              <div className="row gx-4">
                <div className="col-lg-8">
                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header text-gray-900">
                      Selecione o projeto
                    </div>

                    <div className="card-body">
                      <select
                        id="projeto"
                        className="form-control border-left-primary"
                        onChange={handleProjetoChange}
                        required
                      >
                        <option value="">Selecione um projeto</option>
                        {projetos.map((projeto) => (
                          <option key={projeto.id} value={projeto.id}>
                            {projeto.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {idProjeto && (
                    <div className="mb-4 border-left-primary shadow py-2 mb-2">
                      <div className="card-header text-gray-900">
                        Selecione o modelo de tarefa
                      </div>

                      <div className="card-body">
                        <select
                          id="tipoTarefa"
                          className="form-control border-left-primary"
                          onChange={handleTipoTarefaChange}
                          required
                        >
                          <option value="">Selecione um tipo de tarefa</option>
                          {tiposTarefas.map((tipoTarefa) => (
                            <option key={tipoTarefa.id} value={tipoTarefa.id}>
                              {tipoTarefa.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  {subTarefaList.length > 0 && (
                    <div className="mb-4 border-left-primary shadow py-2">
                      <div className="card-header text-gray-900">
                        Etapas do processo
                      </div>
                      {subTarefaList.map((subTarefa, index) => (
                        <div key={subTarefa.id} className="card-body">
                          <div className="">
                            <div className="card-body text-gray-900">
                              <input
                                type="checkbox"
                                className="checkbox mr-2"
                                checked={subTarefa.ativo}
                                onChange={(e) => {
                                  const newSubTarefaList = [...subTarefaList];
                                  newSubTarefaList[index].ativo =
                                    e.target.checked;
                                  setSubTarefaList(newSubTarefaList);
                                }}
                              />
                              <strong>Departamento:</strong>{" "}
                              {getNomeDepartamento(subTarefa.idDepartamento)}
                              <div className="card-body">
                                <div className="form-group">
                                  <label
                                    htmlFor={`responsavel-${subTarefa.idDepartamento}`}
                                  >
                                    Executor
                                  </label>
                                  <select
                                    id={`responsavel_${index}`}
                                    className="form-control border-left-primary"
                                    value={subTarefa.idUsuario}
                                    onChange={(e) => {
                                      const newSubTarefaList = [
                                        ...subTarefaList,
                                      ];
                                      newSubTarefaList[index].idUsuario =
                                        e.target.value;
                                      newSubTarefaList[index].responsavelNome =
                                        usuarios.find(
                                          (u) =>
                                            u.id ===
                                            parseInt(e.target.value, 10)
                                        )?.nome || "";
                                      setSubTarefaList(newSubTarefaList);
                                    }}
                                    required
                                  >
                                    <option value="">
                                      Selecione um responsável
                                    </option>
                                    {usuarios.map((usuario) => (
                                      <option
                                        key={usuario.id}
                                        value={usuario.id}
                                      >
                                        {usuario.nome}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="row justify-content-baseline m-0">
                                <div className="col-lg-6 card-body">
                                  <div className="form-group">
                                    <label htmlFor={`dataInicio_${index}`}>
                                      Data inicial
                                    </label>
                                    <input
                                      type="date"
                                      id={`dataInicio_${index}`}
                                      className="form-control border-left-primary"
                                      value={subTarefa.dataInicio}
                                      onChange={(e) => {
                                        const newSubTarefaList = [
                                          ...subTarefaList,
                                        ];
                                        newSubTarefaList[index].dataInicio =
                                          e.target.value;
                                        setSubTarefaList(newSubTarefaList);
                                      }}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6 card-body">
                                  <div className="form-group">
                                    <label htmlFor={`dataFim_${index}`}>
                                      Data final
                                    </label>
                                    <input
                                      type="date"
                                      id={`dataFim_${index}`}
                                      className="form-control border-left-primary"
                                      value={subTarefa.dataFim}
                                      onChange={(e) => {
                                        const newSubTarefaList = [
                                          ...subTarefaList,
                                        ];
                                        newSubTarefaList[index].dataFim =
                                          e.target.value;
                                        setSubTarefaList(newSubTarefaList);
                                      }}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {subTarefaList.length > 0 && (
                    <div className="mb-4 border-left-primary shadow py-2 mb-2">
                      <div className="card-header text-gray-900">
                        Notas sobre o projeto
                      </div>
                      <div className="card-body">
                        <ReactQuill
                          value={descricao}
                          onChange={(content, delta, source, editor) =>
                            setDescricao(content)
                          }
                          modules={modules}
                          formats={formats}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {subTarefaList.length > 0 && (
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
                        placeholder="Digite a data de início da tarefa..."
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header text-gray-900">
                      Selecione a prioridade
                    </div>
                    <div className="card-body">
                      <select
                        className="form-control border-left-primary"
                        aria-label="Prioridade"
                        value={prioridadeTarefa}
                        onChange={(e) => setPrioridadeTarefa(e.target.value)}
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
                          className="fw-500 btn btn-primary"
                          type="submit"
                        >
                          Salvar projeto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
};

export default NovaTarefa;
