import React, { useEffect, useState } from "react";
import { fetchDepartamentos } from "../../request/DepartamentoApi"; // Importando a função de busca de departamentos
import { fetchUsuarios } from "../../request/UsuarioApi"; // Importando a função de busca de usuários

const ListDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar departamentos
        const departamentosData = await fetchDepartamentos();
        setDepartamentos(departamentosData);

        // Buscar usuários
        const usuariosData = await fetchUsuarios();
        setUsuarios(usuariosData);
      } catch (error) {
        setError("Erro ao buscar dados.");
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const getNomeResponsavel = (idUsuario) => {
    const usuario = usuarios.find(usuario => usuario.id === idUsuario);
    return usuario ? usuario.nome : 'Desconhecido';
  };

  return (
    <>
      {error && <p>{error}</p>}
      {departamentos.length > 0 ? (
        departamentos.map((departamento) => (
          <div className="card border-left-primary shadow h-100 py-1 mb-3" key={departamento.id}>
            <a className="card-link" href={`/departamentos/id?id=${departamento.id}`}>
              <div className="card-body d-flex justify-content-center flex-column">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="me-3 ">
                    <h5 className="">{departamento.nome}</h5>
                    <div className="text-muted small">
                      Responsável: {getNomeResponsavel(departamento.idUsuario) || 'Desconhecido'}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))
      ) : (
        <p>Nenhum departamento encontrado.</p>
      )}
    </>
  );
};

export default ListDepartamentos;
