import React, { useEffect, useRef, useState } from "react";
import { fetchUsuarios, getUsuarioFromLocalStorage } from "../../../request/UsuarioApi";
import imgLogo from "../../../imgs/undraw_profile.svg";
import UserDetails from "./UserDetails";

const ChatPopup = ({ isChatOpen, toggleChat }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const popupRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsuarios = await fetchUsuarios();
        setUsuarios(fetchedUsuarios);

        const getUsuarioAtual = await getUsuarioFromLocalStorage();
        setUsuarioAtual(getUsuarioAtual.usuario)

        const usuariosFiltrados = fetchedUsuarios.filter(
          (usuario) => usuario.id !== getUsuarioAtual.usuario.id
        );
        setUsuarios(usuariosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar usuários.", error);
      }
    };

    fetchData();
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        toggleChat();
      }
    };

    if (isChatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isChatOpen, toggleChat]);

  const handleUserClick = (usuario) => {
    setSelectedUser(usuario);
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  if (!isChatOpen) return null;

  return (
    <div
      ref={popupRef}
      className="shadow"
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        width: "350px",
        height: "440px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        borderRadius: "25px",
        zIndex: 1000,
      }}
    >
      <div
        className="bg-primary rounded shadow"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <span className="text-white font-weight-bold">Chat</span>
        <button
          onClick={toggleChat}
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          className="text-white"
        >
          ✖
        </button>
      </div>

      <div className="p-2 bg-light h-100">
        {selectedUser ? (
          <UserDetails userAtual={usuarioAtual} userSelecionado={selectedUser} onBack={handleBackToList} />
        ) : (
          usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="mb-2 bg-gray-200 rounded"
              onClick={() => handleUserClick(usuario)} // Chama a função quando o usuário é clicado
            >
              <div className="p-2 d-flex align-items-center">
                <img
                  className="rounded-circle mr-2"
                  style={{ width: "30px", height: "30px" }}
                  src={imgLogo}
                  alt="User avatar"
                />
                {usuario.nome}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export default ChatPopup;
