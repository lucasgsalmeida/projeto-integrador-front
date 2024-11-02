import React, { useEffect, useState } from "react";
import {
  fetchUsuarios,
  getUsuarioFromLocalStorage,
} from "../../request/UsuarioApi";
import { fetchTarefasPorUsuario as fetchTarefasPorUsuarioAPI } from "../../request/TarefaApi";
import { fetchProjetos } from "../../request/ProjetoApi";
import { fetchTipoTarefaById } from "../../request/TipoTarefaApi";
import { fetchDepartamentos } from "../../request/DepartamentoApi";
import EditarMinhasTarefas from "../../pages/tarefas/minhas-tarefas/EditarMinhasTarefas"


const ListMinhasTarefas = () => {
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
          const fetchedTarefas = await fetchTarefasPorUsuarioAPI(
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
      {tarefas.length > 0 ? (
        tarefas.map((tarefa) => (
          <TarefaItem
            key={tarefa.id}
            tarefa={tarefa}
            getNomeProjeto={getNomeProjeto}
            usuarioId={usuario.id}
            onClick={() => handleClickTarefa(tarefa)} // Passa a função de clique
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
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };


  useEffect(() => {


    const fetchTipoTarefa = async () => {
      try {
        const [departamentosData] = await Promise.all([fetchDepartamentos(),
        ]);
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

  return (
    <div
      className="card border-left-primary shadow h-100 py-2 mb-3"
      key={tarefa.id}
    >
      <a className="card-link" href="#" onClick={onClick}>
        <div className="card-body d-flex justify-content-center flex-column">
          <div className="d-flex align-items-center justify-content-between">
            <div className="me-3">
              <h5 className="card-title">{nomeTipoTarefa}</h5>
              <div className="text-muted small">
                Projeto: {getNomeProjeto(tarefa.idProjeto)}
              </div>
              <div className="small p-0 m-0">
                {subtarefasDoUsuario.length > 0 ? (
                  subtarefasDoUsuario.map((subTarefa) => (
                    <div className="card-header w-100 mt-2 border-left-primary">
                    <div key={subTarefa.id} className="text-dark p-0">
                      <div>
                        Departamento: {getNomeDepartamento(subTarefa.idDepartamento)}
                      </div>
                      <div>Status: {subTarefa.statusTarefa}</div>
                      <div>Data de Início: {formatarData(subTarefa.dataInicio)}</div>
                      <div>Data de Fim: {formatarData(subTarefa.dataFim)}</div>
                    </div>  </div>
                  ))
                ) : (
                  <div>Nenhuma subtarefa encontrada para este usuário.</div>
                )}
              </div>
            </div>
            <div className="text-muted small">#{tarefa.id}</div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ListMinhasTarefas;
