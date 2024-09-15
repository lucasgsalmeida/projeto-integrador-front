import React, { useEffect, useState } from "react";
import { fetchProjetos } from "../../request/ProjetoApi"; // Importando a função de busca de projetos
import "./ListProjetos";

const ListProjetos = () => {
  const [projetos, setProjetos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projetosData = await fetchProjetos(); // Usando a função importada para buscar projetos
        setProjetos(projetosData);
      } catch (error) {
        setError("Erro ao buscar projetos.");
        console.error("Erro ao buscar projetos:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Date.UTC(year, month - 1, day));
    const formattedDay = (`0${date.getUTCDate()}`).slice(-2);
    const formattedMonth = (`0${date.getUTCMonth() + 1}`).slice(-2);
    const formattedYear = date.getUTCFullYear();
    return `${formattedDay}/${formattedMonth}/${formattedYear}`; // Formato DD/MM/YYYY
  };
  
  

  return (
    <>
      {error && <p>{error}</p>}
      {projetos.length > 0 ? (
        projetos.map((projeto) => (
          <div className="card border-left-primary shadow h-100 py-1 mb-3" key={projeto.id}>
            {/* Dashboard example card */}
            <a className="card-link" href={`/projetos/id?id=${projeto.id}`}>
              <div className="card-body d-flex justify-content-center flex-column">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="me-3 ">
                    <h5 className="">{projeto.nome}</h5>
                    <div className="text-muted small">
                      Status: {projeto.status}
                    </div>
                    <div className="text-muted small">
                    Data de início: {formatDate(projeto.dataInicio)}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))
      ) : (
        <p>Nenhum projeto encontrado.</p>
      )}
    </>
  );
};

export default ListProjetos;
