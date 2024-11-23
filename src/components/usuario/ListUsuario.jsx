import React, { useEffect, useState } from "react";
import { fetchUsuarios } from "../../request/UsuarioApi"; // Importando a função de busca de usuários

const ListUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuariosData = await fetchUsuarios();
        setUsuarios(usuariosData);
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
      {usuarios.length > 0 ? (
        usuarios.map((usuario) => (
          <div className="card border-left-primary shadow h-100 py-1 mb-3" key={usuario.id}>
            <a className="card-link" href={`/usuarios/id?id=${usuario.id}`}>
              <div className="card-body d-flex justify-content-center flex-column">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="me-3">
                    <h5 className="">{usuario.nome}</h5>
                    <div className="text-muted small">
                      Email: {usuario.usuario || 'Desconhecido'}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))
      ) : (
        <p>Nenhum usuário encontrado.</p>
      )}
    </>
  );
};

export default ListUsuario;
