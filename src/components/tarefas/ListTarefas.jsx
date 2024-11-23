import React, { useEffect, useState } from "react";
import { fetchTarefasAbertas, fetchTarefasFechadas } from "../../request/TarefaApi";
import { fetchProjetos } from "../../request/ProjetoApi";
import { fetchTipoTarefaById } from "../../request/TipoTarefaApi";
import EditarMinhasTarefas from "../../pages/tarefas/minhas-tarefas/EditarMinhasTarefas";

const ListTarefas = (tipo) => {

  const tipoConsulta = tipo.tipo

  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [error, setError] = useState(null);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);


  const handleClickTarefa = (tarefa) => {
    setTarefaSelecionada(tarefa);
  };

  const handleClosePopup = () => {
    setTarefaSelecionada(null); // Fechar o popup
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tipoConsulta==="todas") {
        const fetchedTarefas = await fetchTarefasAbertas();
        setTarefas(fetchedTarefas);
      }
      if (tipoConsulta==="arquivo") {
        const fetchedTarefas = await fetchTarefasFechadas();
        setTarefas(fetchedTarefas);
      }
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

const TarefaItem = ({ tarefa, getNomeProjeto, getUltimaSubTarefa, onClick }) => {
  const [nomeTipoTarefa, setNomeTipoTarefa] = useState('Carregando...');

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
      <a className="card-link w-100" href="#" onClick={onClick}>
      <div className="card-body d-flex justify-content-center flex-column">
          <div className="d-flex align-items-center justify-content-between">
            <div className="me-3">
              <h5 className="card-title">{nomeTipoTarefa}</h5>
              <div className="text-muted small">
                Projeto: {getNomeProjeto(tarefa.idProjeto)}
              </div>
              <div className="text-muted small">
                Data de entrega: {ultimaSubTarefa ? formatarData(ultimaSubTarefa.dataFim) : 'Data não encontrada'}
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
