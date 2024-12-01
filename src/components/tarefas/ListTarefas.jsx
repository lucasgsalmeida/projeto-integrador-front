import React, { useEffect, useState } from "react";
import {
  fetchTarefasAbertas,
  fetchTarefasFechadas,
} from "../../request/TarefaApi";
import { fetchProjetos } from "../../request/ProjetoApi";
import { fetchTipoTarefaById } from "../../request/TipoTarefaApi";
import EditarMinhasTarefas from "../../pages/tarefas/minhas-tarefas/EditarMinhasTarefas";
import { fetchUsuarios } from "../../request/UsuarioApi";

const ListTarefas = (tipo) => {
  const tipoConsulta = tipo.tipo;
  const [usuarios, setUsuarios] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [error, setError] = useState(null);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [idUsuarioFiltrado, setidUsuarioFiltrado] = useState("");
  const [filtrarPorStatus, setFiltrarPorStatus] = useState("");
  const [tarefasFiltradas, setTarefasFiltradas] = useState([]);
  const [tarefasFiltradasUsuario, setTarefasFiltradasUsuario] = useState([]);
  const [tarefasFiltradasStatus, setTarefasFiltradasStatus] = useState([]);

  const handleClickTarefa = (tarefa) => {
    setTarefaSelecionada(tarefa);
  };

  const handleClosePopup = () => {
    setTarefaSelecionada(null);
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

        if (idUsuarioFiltrado) {
          if (subTarefa.idUsuario == idUsuarioFiltrado) {
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
        } else {
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

    setTarefasFiltradasStatus(filtro);
  };

  const filtrarPorUsuario = (idUsuario) => {
    const tarefaByUsuarioSelecionado = [];

    tarefas.forEach((tarefa) => {
      let isTarefa = false;

      if (tarefa.idUsuario == idUsuario) {
        isTarefa = true;
      } else {
        tarefa.subTarefaList.forEach((subTarefa) => {
          if (subTarefa.idUsuario == idUsuario) {
            isTarefa = true;
          }
        });
      }

      if (isTarefa) {
        tarefaByUsuarioSelecionado.push(tarefa);
      }
    });
    setTarefasFiltradasUsuario(tarefaByUsuarioSelecionado);
  };

  const removerFiltros = () => {
    setidUsuarioFiltrado("");
    setFiltrarPorStatus("");
    setTarefasFiltradas([]);
  };

  const handleUsuarioChange = (e) => {
    const novoIdUsuario = e.target.value;
    setidUsuarioFiltrado(novoIdUsuario);
    filtrarPorUsuario(novoIdUsuario);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setFiltrarPorStatus(status);
    filtrarVencimentos(status);
  };

  useEffect(() => {
    const calcularFiltrados = () => {
      if (!idUsuarioFiltrado && !filtrarPorStatus) {
        setTarefasFiltradas(tarefas);
        return;
      }

      if (!idUsuarioFiltrado) {
        setTarefasFiltradas(tarefasFiltradasStatus);
        return;
      }

      if (!filtrarPorStatus) {
        setTarefasFiltradas(tarefasFiltradasUsuario);
        return;
      }

      const objetosComuns = tarefasFiltradasUsuario.filter((obj1) =>
        tarefasFiltradasStatus.some(
          (obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)
        )
      );

      setTarefasFiltradas(objetosComuns);
    };

    calcularFiltrados();
  }, [
    idUsuarioFiltrado,
    filtrarPorStatus,
    tarefasFiltradasStatus,
    tarefasFiltradasUsuario,
    tarefas,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tipoConsulta === "todas") {
          const fetchedTarefas = await fetchTarefasAbertas();
          setTarefas(fetchedTarefas);
        }
        if (tipoConsulta === "arquivo") {
          const fetchedTarefas = await fetchTarefasFechadas();
          setTarefas(fetchedTarefas);
        }
        const fetchedProjetos = await fetchProjetos();
        setProjetos(fetchedProjetos);

        const fetchedUsuarios = await fetchUsuarios();
        setUsuarios(fetchedUsuarios);
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

  const getUltimaSubTarefa = (subTarefaList) => {
    if (subTarefaList && subTarefaList.length > 0) {
      const ultimaSubTarefa = subTarefaList[subTarefaList.length - 1];
      return ultimaSubTarefa;
    }
    return null;
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

          <div className="mr-3">
            <select
              className="form-control border-left-primary"
              aria-label="Filtrar por usuário"
              value={idUsuarioFiltrado}
              onChange={handleUsuarioChange}
              required
            >
              <option value="" disabled>
                Filtrar por usuário
              </option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
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
        (idUsuarioFiltrado || filtrarPorStatus
          ? tarefasFiltradas
          : tarefas
        ).map((tarefa) => (
          <TarefaItem
            key={tarefa.id}
            tarefa={tarefa}
            getNomeProjeto={getNomeProjeto}
            getUltimaSubTarefa={getUltimaSubTarefa}
            onClick={() => handleClickTarefa(tarefa)}
          />
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

const TarefaItem = ({
  tarefa,
  getNomeProjeto,
  getUltimaSubTarefa,
  onClick,
}) => {
  const [nomeTipoTarefa, setNomeTipoTarefa] = useState("Carregando...");
  const [usuarios, setUsuarios] = useState([]);

  const formatarData = (dataISO) => {
    const partes = dataISO.split("T")[0].split("-");
    const ano = partes[0];
    const mes = partes[1];
    const dia = partes[2];
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    const fetchTipoTarefa = async () => {
      try {
        const tipoTarefa = await fetchTipoTarefaById(tarefa.id_tipoTarefa);
        setNomeTipoTarefa(tipoTarefa.nome);

        const usuarios = await fetchUsuarios();
        setUsuarios(usuarios);
      } catch (error) {
        console.error("Erro ao buscar tipo de tarefa:", error);
        setNomeTipoTarefa("Desconhecido");
      }
    };

    fetchTipoTarefa();
  }, [tarefa.id_tipoTarefa]);

  const ultimaSubTarefa = getUltimaSubTarefa(tarefa.subTarefaList);

  const getNomeUsuario = (idUsuario) => {
    const usuario = usuarios.find((usuario) => usuario.id === idUsuario);
    return usuario ? usuario.nome : "Desconhecido";
  };

  return (
    <div
      className="card border-left-primary shadow h-100 py-2 mb-3"
      key={tarefa.id}
    >
      <a className="card-link w-100" href="#" onClick={onClick}>
        <div className="card-body d-flex justify-content-center flex-column">
          <div className="d-flex align-items-center justify-content-between">
            <div className="me-3">
              <h5 className="card-title">{nomeTipoTarefa}</h5>
              <div className="text-muted small">
                Projeto: {getNomeProjeto(tarefa.idProjeto)}
              </div>
              <div className="text-muted small">
                Data de entrega:{" "}
                {ultimaSubTarefa
                  ? formatarData(ultimaSubTarefa.dataFim)
                  : "Data não encontrada"}
              </div>
              <div className="text-muted small">
                Solicitante: {getNomeUsuario(tarefa.idUsuario)}
              </div>
            </div>
            <div className="text-muted small">#{tarefa.id}</div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ListTarefas;
