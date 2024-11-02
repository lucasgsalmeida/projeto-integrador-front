import React, { useEffect, useState } from "react";
import { fetchTipoTarefas } from "../../request/TipoTarefaApi";

const ListTipoTarefa = () => {
  const [tipoTarefa, setTipoTarefa] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTipoTarefas = await fetchTipoTarefas();
        setTipoTarefa(fetchedTipoTarefas);
      } catch (error) {
        setError("Erro ao buscar dados.");
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {error && <p>{error}</p>}
      {tipoTarefa.length > 0 ? (
        tipoTarefa.map((tarefa) => (
          <div
            className="card border-left-primary shadow h-100 py-2 mb-3"
            key={tarefa.id}
          >
            <a className="card-link" href={`/tarefas/modelo/id?id=${tarefa.id}`}>
              <div className="card-body d-flex justify-content-center flex-column">
                <div className="d-flex align-items-center justify-content-between p-0 m-0">
                  <div className="me-3 p-0 m-0">
                    <h5 className="card-title p-0 m-0">{tarefa.nome}</h5>
                  </div>
                  <div className="text-muted small">#{tarefa.id}</div>
                </div>
              </div>
            </a>
          </div>
        ))
      ) : (
        <p>Nenhuma tarefa encontrada.</p>
      )}
    </>
  );
};

export default ListTipoTarefa;
