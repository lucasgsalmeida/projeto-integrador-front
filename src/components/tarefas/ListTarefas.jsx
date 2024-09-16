import React, { useEffect, useState } from "react";
import { fetchTarefas } from "../../request/TarefaApi";
import { fetchProjetos } from "../../request/ProjetoApi";
import { fetchTipoTarefaById } from "../../request/TipoTarefaApi";

const ListTarefas = () => {
  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTarefas = await fetchTarefas();
        setTarefas(fetchedTarefas);
    
        const fetchedProjetos = await fetchProjetos();
        setProjetos(fetchedProjetos);
      } catch (error) {
        setError("Erro ao buscar dados.");
        console.error('Erro ao buscar dados:', error);
      }
    };
    
    fetchData();
  }, []);

  const getNomeProjeto = (idProjeto) => {
    const projeto = projetos.find(projeto => projeto.id === idProjeto);
    return projeto ? projeto.nome : 'Desconhecido';
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
      {tarefas.length > 0 ? (
        tarefas.map(tarefa => (
          <TarefaItem
            key={tarefa.id}
            tarefa={tarefa}
            getNomeProjeto={getNomeProjeto}
            getUltimaSubTarefa={getUltimaSubTarefa}
          />
        ))
      ) : (
        <p>Nenhuma tarefa encontrada.</p>
      )}
    </>
  );
};

const TarefaItem = ({ tarefa, getNomeProjeto, getUltimaSubTarefa }) => {
  const [nomeTipoTarefa, setNomeTipoTarefa] = useState('Carregando...');

  useEffect(() => {
    const fetchTipoTarefa = async () => {
      try {
        const tipoTarefa = await fetchTipoTarefaById(tarefa.id_tipoTarefa);
        setNomeTipoTarefa(tipoTarefa.nome);
      } catch (error) {
        console.error('Erro ao buscar tipo de tarefa:', error);
        setNomeTipoTarefa('Desconhecido');
      }
    };

    fetchTipoTarefa();
  }, [tarefa.id_tipoTarefa]);

  const ultimaSubTarefa = getUltimaSubTarefa(tarefa.subTarefaList);

  return (
    <div className="card border-left-primary shadow h-100 py-2 mb-3" key={tarefa.id}>
      <a className="card-link" href={`/editar/${tarefa.id}`}>
        <div className="card-body d-flex justify-content-center flex-column">
          <div className="d-flex align-items-center justify-content-between">
            <div className="me-3">
              <h5 className="card-title">{nomeTipoTarefa}</h5>
              <div className="text-muted small">
                Projeto: {getNomeProjeto(tarefa.idProjeto)}
              </div>
              <div className="text-muted small">
                Data de entrega: {ultimaSubTarefa ? ultimaSubTarefa.dataFim : 'Data não encontrada'}
              </div>
            </div>
            <div className="text-muted small">
              #{tarefa.id}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ListTarefas;
