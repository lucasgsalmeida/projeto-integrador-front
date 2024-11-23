import React, { useEffect, useState } from "react";
import {
  fetchUsuarios,
  getUsuarioFromLocalStorage,
} from "../../request/UsuarioApi";
import { fetchTarefasPorAprovacao, fetchTarefasPorUsuario as fetchTarefasPorUsuarioAPI } from "../../request/TarefaApi";
import { fetchProjetos } from "../../request/ProjetoApi";
import { fetchTipoTarefaById } from "../../request/TipoTarefaApi";
import { fetchDepartamentos } from "../../request/DepartamentoApi";
import EditarMinhasTarefas from "../../pages/tarefas/minhas-tarefas/EditarMinhasTarefas";

const ListParaAprovacao = () => {
  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null); // Estado para armazenar a tarefa selecionada

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedUser = getUsuarioFromLocalStorage();
        setUsuario(loggedUser.usuario);

        if (loggedUser) {
          const fetchedTarefas = await fetchTarefasPorAprovacao(
            loggedUser.usuario.id
          );
          setTarefas(fetchedTarefas);
        } else {
          setError("Usuário não encontrado.");
        }

        const fetchedProjetos = await fetchProjetos();
        setProjetos(fetchedProjetos);
      } catch (error) {
        setError("Erro ao buscar dados.");
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const getNomeProjeto = (idProjeto) => {
    const projeto = projetos.find((projeto) => projeto.id === idProjeto);
    return projeto ? projeto.nome : "Desconhecido";
  };

  const handleClickTarefa = (tarefa) => {
    setTarefaSelecionada(tarefa);
  };

  const handleClosePopup = () => {
    setTarefaSelecionada(null); // Fechar o popup
  };

  return (
    <>
      {error && <p>{error}</p>}
      <div className="row">
        {tarefas.length > 0 ? (
          tarefas.map((tarefa) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 w-100 "
              key={tarefa.id}
            >
              <TarefaItem
                tarefa={tarefa}
                getNomeProjeto={getNomeProjeto}
                usuarioId={usuario.id}
                onClick={() => handleClickTarefa(tarefa)} // Passa a função de clique
              />
            </div>
          ))
        ) : (
          <p>Nenhuma tarefa encontrada.</p>
        )}
      </div>

      {tarefaSelecionada && (
        <EditarParaAprovacao
          tarefa={tarefaSelecionada}
          onClose={handleClosePopup} // Função para fechar o popup
          getNomeProjeto={getNomeProjeto}
        />
      )}
    </>
  );
};

const TarefaItem = ({ tarefa, getNomeProjeto, usuarioId, onClick }) => {
  const [nomeTipoTarefa, setNomeTipoTarefa] = useState("Carregando...");
  const [departamentos, setDepartamentos] = useState([]);

  const getNomeDepartamento = (idDepartamento) => {
    const departamento = departamentos.find(
      (departamento) => departamento.id === idDepartamento
    );
    return departamento ? departamento.nome : "Desconhecido";
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    const fetchTipoTarefa = async () => {
      try {
        const [departamentosData] = await Promise.all([fetchDepartamentos()]);
        setDepartamentos(departamentosData);

        const tipoTarefa = await fetchTipoTarefaById(tarefa.id_tipoTarefa);
        setNomeTipoTarefa(tipoTarefa.nome);
      } catch (error) {
        console.error("Erro ao buscar tipo de tarefa:", error);
        setNomeTipoTarefa("Desconhecido");
      }
    };

    fetchTipoTarefa();
  }, [tarefa.id_tipoTarefa]);

  // Filtrando as subtarefas que pertencem ao usuário
  const subtarefasDoUsuario = tarefa.subTarefaList.filter(
    (subTarefa) => subTarefa.idUsuario === usuarioId
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "CONCLUIDO":
        return "bg-success";
      case "PARA_FAZER":
        return "bg-dark";
      case "FAZENDO":
        return "bg-info";
      case "APROVACAO":
        return "bg-warning bg-gradient $yellow";
      default:
        return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "CONCLUIDO":
        return "text-white";
      case "PARA_FAZER":
        return "text-white";
      case "FAZENDO":
        return "text-black";
      case "APROVACAO":
        return "text-black";
      default:
        return "";
    }
  };
  return (
    <div
      className="card border-left-primary shadow h-100 py-2 mb-3 w-100 "
      key={tarefa.id}
    >
      <a className="card-link w-100" href="#" onClick={onClick}>
        <div className="card-body d-flex justify-content-center flex-column w-100 ">
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="me-3 w-100">
              <h5 className="card-title">{nomeTipoTarefa}</h5>
              <div className="text-muted small">
                Projeto: {getNomeProjeto(tarefa.idProjeto)}
              </div>
              <div className="small p-0 m-0">
                {subtarefasDoUsuario.length > 0 ? (
                  subtarefasDoUsuario.map((subTarefa) => (
                    <div
                      key={subTarefa.id}
                      className={`card-header w-100 mt-2 border-left-primary ${getStatusClass(
                        subTarefa.statusTarefa
                      )}`}
                    >
                      {" "}
                      <div key={subTarefa.id} className="text-dark p-0">
                        <div
                          className={`${getStatusText(subTarefa.statusTarefa)}`}
                        >
                          Departamento:{" "}
                          <b>{getNomeDepartamento(subTarefa.idDepartamento)}</b>
                        </div>
                        <div
                          className={`${getStatusText(subTarefa.statusTarefa)}`}
                        >
                          Status: <b>{subTarefa.statusTarefa}</b>
                        </div>
                        <div
                          className={`${getStatusText(subTarefa.statusTarefa)}`}
                        >
                          Data de Início: {formatarData(subTarefa.dataInicio)}
                        </div>
                        <div
                          className={`${getStatusText(subTarefa.statusTarefa)}`}
                        >
                          Data de Fim: {formatarData(subTarefa.dataFim)}
                        </div>
                      </div>{" "}
                    </div>
                  ))
                ) : (
                  <div>Nenhuma subtarefa encontrada para este usuário.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ListParaAprovacao;
