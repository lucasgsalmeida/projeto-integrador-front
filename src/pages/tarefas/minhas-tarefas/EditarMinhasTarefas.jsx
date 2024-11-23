import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomComents.css";
import { fetchTipoTarefaById } from "../../../request/TipoTarefaApi";
import ReactQuill from "react-quill";
import {
  fetchUsuarios,
  getUsuarioFromLocalStorage,
} from "../../../request/UsuarioApi";
import { fetchDepartamentos } from "../../../request/DepartamentoApi";
import { atualizarTarefa } from "../../../request/TarefaApi";

function EditarMinhasTarefas({ tarefa, onClose, getNomeProjeto }) {
  const navigate = useNavigate();
  const [tarefaAtualizada, setTarefaAtualizada] = useState(tarefa);
  const [nomeTipoTarefa, setNomeTipoTarefa] = useState("Carregando...");
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [comentariosEditando, setComentariosEditando] = useState({});
  const [comentarioSubTarefa, setComentarioSubTarefa] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    tarefaAtualizada.subTarefaList.forEach((subTarefa, index) => {
      const comentarioMensagem = comentarioSubTarefa[index];
      if (comentarioMensagem) {
        const usuario = getUsuarioFromLocalStorage();
        const usuarioId = usuario.usuario.id;

        const comentario = {
          idUsuario: usuarioId,
          mensagem: comentarioMensagem,
        };

        subTarefa.comentarios.push(comentario);
      }
    });

    console.log(tarefa);

    try {
      await atualizarTarefa(tarefaAtualizada.id, tarefaAtualizada);
      navigate("/tarefas/list");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const handleNovoComentario = (index) => {
    setComentariosEditando((prevState) => ({
      ...prevState,
      [index]: true, // Define como true ao clicar no botão
    }));
  };

  const editarComentario = (index, mensagem) => {
    setComentarioSubTarefa((prevState) => ({
      ...prevState,
      [index]: mensagem,
    }));
  };

  const getNomeDepartamento = (idDepartamento) => {
    const departamento = departamentos.find(
      (departamento) => departamento.id === idDepartamento
    );
    return departamento ? departamento.nome : "Desconhecido";
  };

  const getNomeUsuario = (idUsuario) => {
    const usuario = usuarios.find((usuario) => usuario.id === idUsuario);
    return usuario ? usuario.nome : "Desconhecido";
  };

  useEffect(() => {
    const fetchTipoTarefa = async () => {
      try {
        const tipoTarefa = await fetchTipoTarefaById(tarefa.id_tipoTarefa);
        const usuarios = await fetchUsuarios();
        const departamentos = await fetchDepartamentos();

        setUsuarios(usuarios);
        setNomeTipoTarefa(tipoTarefa.nome);
        setDepartamentos(departamentos);
      } catch (error) {
        console.error("Erro ao buscar tipo de tarefa:", error);
        setNomeTipoTarefa("Desconhecido");
      }
    };

    fetchTipoTarefa();
  }, [tarefa.id_tipoTarefa]);

  const handleInputChange = (field, value, subTarefaIndex) => {
    setTarefaAtualizada((prevTarefa) => {
      const updatedTarefa = { ...prevTarefa };

      if (subTarefaIndex !== undefined) {
        updatedTarefa.subTarefaList[subTarefaIndex] = {
          ...updatedTarefa.subTarefaList[subTarefaIndex],
          [field]: value,
        };
      } else {
        updatedTarefa[field] = value;
      }

      return updatedTarefa;
    });
  };

  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.popup} className="position-relative p-2 pt-5">
        <main>
          <form onSubmit={handleSubmit}>
            <div className="row align-items-center justify-content-between">
              <a
                onClick={onClose}
                className="btn btn-danger btn-icon-split shadow position-absolute"
                style={{
                  top: "10px",
                  right: "10px",
                  padding: "0.5rem",
                }}
              >
                <span className="btn btn-danger btn-icon-split text-white-50">
                  <i className="fas fa-minus" />
                </span>
              </a>
            </div>
            <div className="container-fluid">
              <div className="m-0">
                <div className="mb-2 border-left-primary shadow p-0 pl-3">
                  <div className="card-header text-gray-900 m-0 p-1">
                    Projeto: {getNomeProjeto(tarefa.idProjeto)}
                  </div>
                </div>

                <div className="mb-2 border-left-primary shadow p-0 pl-3">
                  <div className="card-header text-gray-900 m-0 p-1">
                    Tipo de tarefa: {nomeTipoTarefa}
                  </div>
                </div>

                <div className="mb-2 border-left-primary shadow p-0 pl-3">
                  <div className="card-header text-gray-900 m-0 p-1">
                    Etapas do processo
                  </div>
                </div>

                {tarefa.subTarefaList.map((subTarefa, index) => {
                  const borderClass = "border-left-primary";
                  const cardClass = "";
                  const formClass = "border-left-primary";
                  const formExecutor = "";

                  return (
                    <div className="">
                      <div
                        key={subTarefa.id}
                        className={`mb-4 ${borderClass} shadow py-2`}
                      >
                        <div>
                          <div
                            className={`card-header text-gray-900 pt-3 ${cardClass}`}
                          >
                            <div className="mb-2">
                              <div className="card border-left-primary p-2">
                                Departamento:{" "}
                                {getNomeDepartamento(subTarefa.idDepartamento)}
                              </div>
                            </div>{" "}
                            <div className="card-body m-0 p-0 mt-3">
                              <div className={`form-group ${formExecutor}`}>
                                <label>Executor</label>
                                <select
                                  id={`responsavel_${index}`}
                                  className={`form-control ${formClass}`}
                                  value={subTarefa.idUsuario}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "idUsuario",
                                      e.target.value,
                                      index
                                    )
                                  }
                                  required
                                >
                                  <option value="">
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
                            <div className={`row ${cardClass} mb-0`}>
                              <div className="col-lg-4 card-body mb-0">
                                <div className="form-group mb-0">
                                  <label
                                    className="mb-0"
                                    htmlFor={`dataInicio_${index}`}
                                  >
                                    Data inicial
                                  </label>
                                  <input
                                    type="date"
                                    id={`dataInicio_${index}`}
                                    className={`form-control ${formClass}`}
                                    value={subTarefa.dataInicio}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "dataInicio",
                                        e.target.value,
                                        index
                                      )
                                    }
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-lg-4 card-body mb-0">
                                <div className="form-group mb-0">
                                  <label
                                    className="mb-0"
                                    htmlFor={`dataFim_${index}`}
                                  >
                                    Data final
                                  </label>
                                  <input
                                    type="date"
                                    id={`dataFim_${index}`}
                                    className={`form-control ${formClass}`}
                                    value={subTarefa.dataFim}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "dataFim",
                                        e.target.value,
                                        index
                                      )
                                    }
                                    required
                                  />
                                </div>
                              </div>{" "}
                            </div>
                            <label
                              htmlFor="statusTarefa"
                              className="form-label"
                            >
                              Status da tarefa
                            </label>
                            <select
                              id="statusTarefa"
                              className="form-control border-left-primary mb-3"
                              aria-label="Status"
                              value={subTarefa.statusTarefa}
                              onChange={(e) =>
                                handleInputChange(
                                  "statusTarefa",
                                  e.target.value,
                                  index
                                )
                              }
                              required
                            >
                              <option value="" disabled>
                                Status
                              </option>
                              <option value="CONCLUIDO">CONCLUÍDO</option>
                              <option value="FAZENDO">FAZENDO</option>
                              <option value="PARA_FAZER">PARA FAZER</option>
                              <option value="APROVACAO">PARA APROVAÇÃO</option>
                            </select>
                            {subTarefa.comentarios.length >= 1 && (
                              <>
                                <div
                                  className={`card border-left-primary p-2 ${cardClass}`}
                                >
                                  Comentários
                                </div>
                                {subTarefa.comentarios.map((coment, index) => (
                                  <div
                                    role="alert"
                                    className="p-0 m-0 mb-4"
                                    key={coment.id}
                                  >
                                    <div className="card-body pr-1 mt-4 custom-comment-container">
                                      <div className="card-body m-0 p-0 text-uppercase font-weight-bold">
                                        {getNomeUsuario(coment.idUsuario)}
                                      </div>
                                      <ReactQuill
                                        value={coment.mensagem} // Exibe a mensagem
                                        readOnly={true} // Define o Quill como não editável
                                        theme="bubble" // Tema mais leve e ideal para visualização de texto não editável
                                      />
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                            {!comentariosEditando[index] && (
                              <a
                                onClick={() => handleNovoComentario(index)}
                                className="btn btn-primary btn-icon-split shadow"
                              >
                                <span className="icon text-white-50">
                                  <i className="fas fa-check" />
                                </span>
                                <span className="text">Novo comentário</span>
                              </a>
                            )}
                            {comentariosEditando[index] && (
                              <div className="text-gray-900 m-0">
                                <div className="text-gray-900 m-0">
                                  Meu comentário:
                                </div>
                                <div className="text-gray-900 m-0 p-1">
                                  <ReactQuill
                                    value={comentarioSubTarefa[index]}
                                    onChange={(value) =>
                                      editarComentario(index, value)
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card-body bottom-0 start-0 end-0 p-3">
              <div className="d-flex justify-content-start">
                <button className="fw-500 btn btn-primary ml-2" type="submit">
                  Salvar tarefa
                </button>
                <button className="fw-500 btn btn-danger ml-4" type="submit">
                  Excluir tarefa
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

const popupStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "1200px",
    width: "100%",
    maxHeight: "80vh", // Limita a altura do popup
    overflowY: "auto", // Permite scroll vertical se o conteúdo ultrapassar a altura máxima
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default EditarMinhasTarefas;
