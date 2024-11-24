import React, { useEffect, useState } from "react";
import { getUsuarioFromLocalStorage } from "../../request/UsuarioApi";
import { fetchTarefasPorUsuario as fetchTarefasPorUsuarioAPI } from "../../request/TarefaApi";
import { fetchProjetos } from "../../request/ProjetoApi";
import { fetchDepartamentos } from "../../request/DepartamentoApi";
import {
  fetchTipoTarefaById,
  fetchTipoTarefas,
} from "../../request/TipoTarefaApi";

const ListVencimento = () => {
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

  const filtrarPorData = (subTarefas) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);
    const daquiSeteDias = new Date(hoje);
    daquiSeteDias.setDate(hoje.getDate() + 7);

    const vencimentoHoje = [];
    const vencimentoAmanha = [];
    const vencimentoSeteDias = [];

    subTarefas.forEach((subTarefa) => {
      const dataFim = new Date(subTarefa.dataFim);
      dataFim.setHours(0, 0, 0, 0);

      if (dataFim.getTime() === hoje.getTime()) {
        vencimentoHoje.push(subTarefa);
      } else if (dataFim.getTime() === amanha.getTime()) {
        vencimentoAmanha.push(subTarefa);
      } else if (
        dataFim.getTime() > amanha.getTime() &&
        dataFim.getTime() <= daquiSeteDias.getTime()
      ) {
        vencimentoSeteDias.push(subTarefa);
      }
    });

    return { vencimentoHoje, vencimentoAmanha, vencimentoSeteDias };
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

  const { vencimentoHoje, vencimentoAmanha, vencimentoSeteDias } =
    getSubTarefasFiltradas();

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const getNomeDepartamento = (idDepartamento) => {
    const departamento = departamentos.find(
      (departamento) => departamento.id === idDepartamento
    );
    return departamento ? departamento.nome : "Desconhecido";
  };

  return (
    <>
      {error && <p>{error}</p>}
      <div className="container-fluid">
        <div className="row">
          {/* Coluna de Hoje */}
          <div className="col-12 col-md-4">
            <div className="card">
              <div className="card-header bg-warning text-white text-center">
                <h5 className="font-weight-bold text-uppercase">Hoje</h5>
              </div>
              <div className="card-body">
                {vencimentoHoje.length > 0 ? (
                  <ExibirVencimentos
                    vencimento={vencimentoHoje}
                    getNomeTipoTarefas={getNomeTipoTarefas}
                    getNomeDepartamento={getNomeDepartamento}
                  />
                ) : (
                  <p className="text-center">Nenhuma tarefa para hoje.</p>
                )}
              </div>
            </div>
          </div>

          {/* Coluna de Amanhã */}
          <div className="col-12 col-md-4">
            <div className="card">
              <div className="card-header bg-info text-white text-center">
                <h5 className="font-weight-bold text-uppercase">Amanhã</h5>
              </div>
              <div className="card-body">
                {vencimentoAmanha.length > 0 ? (
                  <ExibirVencimentos
                    vencimento={vencimentoAmanha}
                    getNomeTipoTarefas={getNomeTipoTarefas}
                    getNomeDepartamento={getNomeDepartamento}
                  />
                ) : (
                  <p className="text-center">Nenhuma tarefa para amanhã.</p>
                )}
              </div>
            </div>
          </div>

          {/* Coluna dos Próximos 7 Dias */}
          <div className="col-12 col-md-4">
            <div className="card">
              <div className="card-header bg-success text-white text-center">
                <h5 className="font-weight-bold text-uppercase">
                  Próximos 7 Dias
                </h5>
              </div>
              <div className="card-body">
                {vencimentoSeteDias.length > 0 ? (
                  <ExibirVencimentos
                    vencimento={vencimentoSeteDias}
                    getNomeTipoTarefas={getNomeTipoTarefas}
                    getNomeDepartamento={getNomeDepartamento}
                  />
                ) : (
                  <p className="text-center">
                    Nenhuma tarefa nos próximos 7 dias.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const ExibirVencimentos = ({
  vencimento,
  getNomeTipoTarefas,
  getNomeDepartamento,
}) => {
  return (
    <>
      {vencimento.length > 0 && (
        <>
          {vencimento.map((subTarefa) => (
            <div key={subTarefa.id} className="card-header border-left-primary">
              <div className="text-dark p-0 display-6">
                <div>
                  <b>{getNomeTipoTarefas(subTarefa.tarefa.id_tipoTarefa)}</b>
                </div>
                <div>
                  Departamento:{" "}
                  <b>{getNomeDepartamento(subTarefa.idDepartamento)}</b>
                </div>
                <div>
                  Status: <b>{subTarefa.statusTarefa}</b>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ListVencimento;
