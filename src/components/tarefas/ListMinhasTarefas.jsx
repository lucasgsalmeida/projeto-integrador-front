import React, { useEffect, useState } from "react";
import {
  fetchUsuarios,
  getUsuarioFromLocalStorage,
} from "../../request/UsuarioApi";
import {
  fetchTarefasPorAprovacao,
  fetchTarefasPorUsuario as fetchTarefasPorUsuarioAPI,
} from "../../request/TarefaApi";
import { fetchProjetos } from "../../request/ProjetoApi";
import { fetchTipoTarefaById } from "../../request/TipoTarefaApi";
import { fetchDepartamentos } from "../../request/DepartamentoApi";
import EditarMinhasTarefas from "../../pages/tarefas/minhas-tarefas/EditarMinhasTarefas";

const ListMinhasTarefas = (tipo) => {
  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [filtrarPorStatus, setFiltrarPorStatus] = useState("");
  const [tarefasFiltradas, setTarefasFiltradas] = useState([]);

  const tipoConsulta = tipo.tipo;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedUser = getUsuarioFromLocalStorage();
        setUsuario(loggedUser.usuario);

        if (loggedUser) {
          if (tipoConsulta === "aprovacao") {
            const fetchedTarefas = await fetchTarefasPorAprovacao(
              loggedUser.usuario.id
            );
            setTarefas(fetchedTarefas);
          }
          if (tipoConsulta === "todas") {
            const fetchedTarefas = await fetchTarefasPorUsuarioAPI(
              loggedUser.usuario.id
            );
            setTarefas(fetchedTarefas);
          }
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
    setTarefaSelecionada(null);
  };

  const handleStatusChange = (e) => {
    setTarefasFiltradas([])
    const status = e.target.value;
    setFiltrarPorStatus(status);
    filtrarVencimentos(status);
  };

  const filtrarVencimentos = (status) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const daquiSeteDias = new Date(hoje);
    daquiSeteDias.setDate(hoje.getDate() + 7);

    const filtro = [];

    tarefas.forEach((tarefa) => {
      tarefa.subTarefaList.forEach((subTarefa) => {
        const dataFim = new Date(subTarefa.dataFim);
        dataFim.setHours(0, 0, 0, 0);
        dataFim.setDate(dataFim.getDate() + 1);

        if (subTarefa.idUsuario === usuario.id) {

        if (status === "1") {
          if (dataFim.getTime() < hoje.getTime()) {
            filtro.push(tarefa);
          }
        }

        if (status === "2") {
          if (dataFim.getTime() === hoje.getTime()) {
            filtro.push(tarefa);
          }
        }

        if (status === "3") {
          if (dataFim.getTime() === amanha.getTime()) {
            filtro.push(tarefa);
          }
        }
        if (status === "4") {
          if (
            dataFim.getTime() > amanha.getTime() &&
            dataFim.getTime() <= daquiSeteDias.getTime()
          ) {
            filtro.push(tarefa);
          }
        }
        }
      });
    });
    setTarefasFiltradas(filtro);
  };

  const removerFiltros = () => {
    setFiltrarPorStatus("");
    setTarefasFiltradas([]);
  };

  return (
    <>
      {error && <p>{error}</p>}
      {tarefas.length > 0 && (
        <div className="d-flex align-items-center mb-3">
          <div className="mr-3">
            <a
              className="btn btn-danger btn-icon-split shadow"
              onClick={removerFiltros}
            >
              <span className="icon text-white-50">
                <i className="fas fa-minus" />
              </span>
              <span className="text">Remover Filtros</span>
            </a>
          </div>
          <div>
            <select
              className="form-control border-left-primary"
              aria-label="Filtrar por vencimento"
              value={filtrarPorStatus}
              onChange={handleStatusChange}
              required
            >
              <option value="" disabled>
                Filtrar por vencimento
              </option>
              <option value="1">Vencidas</option>
              <option value="2">Vence hoje</option>
              <option value="3">Vence amanhã</option>
              <option value="4">Vence em sete dias</option>
            </select>
          </div>
        </div>
      )}

      {tarefas.length > 0 ? (
        (filtrarPorStatus ? tarefasFiltradas : tarefas).map((tarefa) => (
          <div
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 w-100 pt-3 pl-0"
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
      {tarefaSelecionada && (
        <EditarMinhasTarefas
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

export default ListMinhasTarefas;
