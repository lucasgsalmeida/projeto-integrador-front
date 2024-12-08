import React, { useEffect, useState } from "react";
import { getUsuarioFromLocalStorage } from "../../request/UsuarioApi";
import { fetchTarefasPorUsuario as fetchTarefasPorUsuarioAPI } from "../../request/TarefaApi";
import { fetchProjetos } from "../../request/ProjetoApi";
import { fetchDepartamentos } from "../../request/DepartamentoApi";
import {
  fetchTipoTarefaById,
  fetchTipoTarefas,
} from "../../request/TipoTarefaApi";

const ListKanban = () => {
  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [tipoTarefas, setTipoTarefas] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tipoTarefa = await fetchTipoTarefas();
        setTipoTarefas(tipoTarefa);

        const loggedUser = getUsuarioFromLocalStorage();
        setUsuario(loggedUser.usuario);

        const fetchedTarefas = await fetchTarefasPorUsuarioAPI(
          loggedUser.usuario.id
        );
        setTarefas(fetchedTarefas);

        const fetchedProjetos = await fetchProjetos();
        setProjetos(fetchedProjetos);

        const departamentosFetch = await fetchDepartamentos();
        setDepartamentos(departamentosFetch);
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

  const getNomeTipoTarefas = (idTipoTarefa) => {
    const tipoTarefa = tipoTarefas.find(
      (tipoTarefa) => tipoTarefa.id === idTipoTarefa
    );
    return tipoTarefa ? tipoTarefa.nome : "Desconhecido";
  };

  const formatDateToLocal = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return date;
  };

  const filtrarPorData = (subTarefas) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const daquiSeteDias = new Date(hoje);
    daquiSeteDias.setDate(hoje.getDate() + 7);

    const paraFazer = [];
    const EmAndamento = [];
    const concluido = [];
    const paraAprovacao = [];

    subTarefas.forEach((subTarefa) => {
      const dataFim = new Date(subTarefa.dataFim);
      dataFim.setHours(0, 0, 0, 0);

      if (dataFim.getTime() <= daquiSeteDias.getTime()) {
        if (subTarefa.statusTarefa === "PARA_FAZER") {
          paraFazer.push(subTarefa);
        } else if (subTarefa.statusTarefa === "FAZENDO") {
          EmAndamento.push(subTarefa);
        } else if (subTarefa.statusTarefa === "CONCLUIDO") {
          concluido.push(subTarefa);
        } else if (subTarefa.statusTarefa === "APROVACAO") {
          paraAprovacao.push(subTarefa);
        }
      }
    });

    return { paraFazer, EmAndamento, concluido, paraAprovacao };
  };

  const getSubTarefasFiltradas = () => {
    const todasSubTarefas = tarefas.flatMap((tarefa) =>
      tarefa.subTarefaList.map((subTarefa) => ({
        ...subTarefa,
        tarefa,
      }))
    );
    return filtrarPorData(todasSubTarefas);
  };

  const { paraFazer, EmAndamento, concluido, paraAprovacao } =
    getSubTarefasFiltradas();

  const getNomeDepartamento = (idDepartamento) => {
    const departamento = departamentos.find(
      (departamento) => departamento.id === idDepartamento
    );
    return departamento ? departamento.nome : "Desconhecido";
  };

  return (
    <>
      {error && <p>{error}</p>}
      <div className="container-fluid p-0 m-0">
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="card">
              <div className="d-flex bg-danger text-white align-items-center justify-content-center m-0 p-2 rounded">
                <h5 className="font-weight-bold text-uppercase h6 text-center m-0 p-0">
                  Para aprovação
                </h5>
              </div>
              <div className="card-body">
                {paraAprovacao.length > 0 ? (
                  <ExibirItens
                    vencimento={paraAprovacao}
                    getNomeTipoTarefas={getNomeTipoTarefas}
                    getNomeDepartamento={getNomeDepartamento}
                  />
                ) : (
                  <p className="text-center">
                    Nenhuma tarefa aguardando aprovação.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="card">
              <div className="d-flex bg-dark text-white align-items-center justify-content-center m-0 p-2 rounded">
                <h5 className="font-weight-bold text-uppercase h6 text-center m-0 p-0">
                  Para fazer
                </h5>
              </div>
              <div className="card-body">
                {paraFazer.length > 0 ? (
                  <ExibirItens
                    vencimento={paraFazer}
                    getNomeTipoTarefas={getNomeTipoTarefas}
                    getNomeDepartamento={getNomeDepartamento}
                  />
                ) : (
                  <p className="text-center">Nenhuma tarefa para fazer.</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="card">
              <div className="d-flex bg-info text-white align-items-center justify-content-center m-0 p-2 rounded">
                <h5 className="font-weight-bold text-uppercase h6 text-center m-0 p-0">
                  Em andamento
                </h5>
              </div>
              <div className="card-body">
                {EmAndamento.length > 0 ? (
                  <ExibirItens
                    vencimento={EmAndamento}
                    getNomeTipoTarefas={getNomeTipoTarefas}
                    getNomeDepartamento={getNomeDepartamento}
                  />
                ) : (
                  <p className="text-center">Nenhuma tarefa em andamento.</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="card">
              <div className="d-flex bg-success text-white align-items-center justify-content-center m-0 p-2 rounded">
                <h5 className="font-weight-bold text-uppercase h6 text-center m-0 p-0">
                  Concluído
                </h5>
              </div>
              <div className="card-body">
                {concluido.length > 0 ? (
                  <ExibirItens
                    vencimento={concluido}
                    getNomeTipoTarefas={getNomeTipoTarefas}
                    getNomeDepartamento={getNomeDepartamento}
                  />
                ) : (
                  <p className="text-center">Nenhuma tarefa concluída</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const ExibirItens = ({
  vencimento,
  getNomeTipoTarefas,
  getNomeDepartamento,
}) => {
  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    data.setDate(data.getDate() + 1);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <>
      {vencimento.length > 0 && (
        <>
          {vencimento.map((subTarefa) => (
            <div
              key={subTarefa.id}
              className="card-header border-left-primary mb-3 h-6"
            >
              <div className="text-dark p-0 h-6">
                <div className="h6 m-0 p-0">
                  <b>{getNomeTipoTarefas(subTarefa.tarefa.id_tipoTarefa)}</b>
                </div>
                <div className="text-xs">
                  Departamento:{" "}
                  <b>{getNomeDepartamento(subTarefa.idDepartamento)}</b>
                </div>
                <div className="text-xs">
                  Data final: <b>{formatarData(subTarefa.dataFim)}</b>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ListKanban;
