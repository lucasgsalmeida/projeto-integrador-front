import React, { useEffect, useState } from "react";
import { fetchTipoTarefaById } from "../../../request/TipoTarefaApi";
import ReactQuill from "react-quill";
import { fetchUsuarios } from "../../../request/UsuarioApi";
import { fetchDepartamentos } from "../../../request/DepartamentoApi";

function EditarMinhasTarefas({ tarefa, onClose, getNomeProjeto }) {
  const [nomeTipoTarefa, setNomeTipoTarefa] = useState("Carregando...");
  const [usuarios, setUsuarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [novoComentario, setNovoComentario] = useState(
    Array(tarefa.subTarefaList.length).fill(false)
  );

  const escreverNovoComentario = (index) => {
    setNovoComentario((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index]; // Alterna entre true e false no índice específico
      return newState;
    });
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

  return (
    <div style={popupStyles.overlay}>
      <div style={popupStyles.popup}>
        <main>
          <form>
            <header className="page-header page-header-compact page-header-light border-bottom mb-4">
              <div className="container-fluid px-4">
                <div className="page-header-content">
                  <div className="row align-items-center justify-content-between pt-3">
                    <div className="card-header text-gray-900 d-flex justify-content-center align-items-center">
                      <h1 className="h3 mb-0 text-gray-800">Tarefa</h1>

                      <a
                        onClick={onClose}
                        className="btn btn-primary btn-icon-split shadow justify-content-right"
                      >
                        <span className="icon text-white-50">
                          <i className="fas fa-minus" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            {/* Main page content*/}
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
                    // Adicione o return aqui
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
                            <div className="mb-2">
                              <div className="card border-left-primary p-2">
                                Executor: {getNomeUsuario(subTarefa.idUsuario)}
                              </div>
                            </div>
                            <div
                              className={`row ${cardClass} mb-0`}
                            >
                              <div className="col-lg-4 card-body mb-0">
                                <div className="form-group mb-0">
                                  <label className="mb-0" htmlFor={`dataInicio_${index}`}>
                                    Data inicial
                                  </label>
                                  <input
                                    type="date"
                                    id={`dataInicio_${index}`}
                                    className={`form-control ${formClass}`}
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
                              <div className="col-lg-4 card-body mb-0">
                                <div className="form-group mb-0">
                                  <label className="mb-0" htmlFor={`dataFim_${index}`}>
                                    Data final
                                  </label>
                                  <input
                                    type="date"
                                    id={`dataFim_${index}`}
                                    className={`form-control ${formClass}`}
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
                              </div>{" "}
                            </div>


                            <select
                          className="form-control border-left-primary mb-3"
                          aria-label="Prioridade"
                          value=""
                          required
                        >
                          <option value="" disabled>
                            Status
                          </option>
                          <option value="CONCLUIDO">CONCLUÍDO</option>
                          <option value="FAZENDO">FAZENDO</option>
                          <option value="PARA_FAZER">PARA FAZER</option>
                        </select>


                            <div className={`card border-left-primary p-2 ${cardClass}`}>
                              Comentários
                            </div>
                            {subTarefa.comentarios.map((coment, index) => (
                              <div role="alert" className="p-0 mb-4" key={coment.id}>
                                <div className="card-body text-gray-900 m-3 p-0">
                                  {getNomeUsuario(coment.idUsuario)}
                                </div>
                                <div className="card-body text-gray-900 m-0 p-0">
                                  <ReactQuill
                                    value={coment.mensagem} // Exibe a mensagem
                                    readOnly={true} // Define o Quill como não editável
                                    theme="bubble" // Tema mais leve e ideal para visualização de texto não editável
                                  />
                                </div>
                              </div>
                            ))}
                            {!novoComentario[index] && (
                              <a
                                onClick={() => escreverNovoComentario(index)} // Passa o índice da subtarefa
                                className="btn btn-primary btn-icon-split shadow"
                              >
                                <span className="icon text-white-50">
                                  <i className="fas fa-check" />
                                </span>
                                <span className="text">Novo comentário</span>
                              </a>
                            )}
                            {novoComentario[index] && (
                              <div className="">
                                <div className="text-gray-900 m-0">
                                  Meu comentário:
                                </div>
                                <div className="text-gray-900 m-0 p-1">
                                  <ReactQuill
                                    value={subTarefa.comentarios.mensagem}
                                    onChange={(newValue) => {
                                      const newSubTarefaList = [
                                        ...subTarefaList,
                                      ];
                                      newSubTarefaList[
                                        index
                                      ].comentarios.mensagem = newValue;
                                      setSubTarefaList(newSubTarefaList);
                                    }}
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
    maxWidth: "900px",
    width: "100%",
    maxHeight: "80vh", // Limita a altura do popup
    overflowY: "auto", // Permite scroll vertical se o conteúdo ultrapassar a altura máxima
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

export default EditarMinhasTarefas;
