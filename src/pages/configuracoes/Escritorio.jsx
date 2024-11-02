import React, { useEffect, useState } from "react";
import { fetchEscritorio } from "../../request/EscritorioApi";

const Escritorio = () => {

  const [escritorio, setEscritorio] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchetEscritorio = await fetchEscritorio();
        setEscritorio(fetchetEscritorio);

      } catch (error) {
        setError("Erro ao buscar dados.");
        console.error('Erro ao buscar dados:', error);
      }
    };
    
    fetchData();
  }, []);


  return (
    <>
      <div className="container-fluid">
        <div className="m-0">

        <div className="mb-2 border-left-primary shadow p-0 pl-3">
            <div className="card-header text-gray-900 m-0 p-1">
              <b>ID:</b> {escritorio.id}
            </div>
          </div>
          <div className="mb-2 border-left-primary shadow p-0 pl-3">
            <div className="card-header text-gray-900 m-0 p-1">
              <b>Nome do escritório:</b> {escritorio.nome}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Escritorio;
