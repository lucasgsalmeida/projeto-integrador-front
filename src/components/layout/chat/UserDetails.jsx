import React, { useEffect, useState } from "react";
import imgLogo from "../../../imgs/undraw_profile.svg";
import {
  createMensagem,
  getMensagens,
  saveMensagem,
} from "../../../request/ChatApi";

const UserDetails = ({ userAtual, userSelecionado, onBack }) => {
  const [mensagem, setMensagem] = useState("");
  const [listMensagens, setListMensagens] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const mensagens = await getMensagens(userAtual.id, userSelecionado.id);
        setListMensagens(mensagens);
      } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
      }
    };

    // Primeira chamada para buscar as mensagens ao carregar o componente
    fetchMessages();

    // Configurando o polling para verificar mensagens a cada 5 segundos
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    // Limpando o intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, [userAtual.id, userSelecionado.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mensagem.trim()) {
      return;
    }

    const dataEnvio = new Date().toISOString();

    try {
      const mensagemData = {
        texto: mensagem,
        dataEnvio: dataEnvio,
        idUsuarioRemetente: userAtual.id,
        idUsuarioDestinatario: userSelecionado.id,
      };

      await createMensagem(mensagemData);
      saveMensagem(mensagemData, setListMensagens); // Salva a mensagem diretamente no estado
      setMensagem(""); // Limpar o campo de texto
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return (
    <div className="mt-0 p-2 bg-white border rounded" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        className="p-0 m-0"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          className="rounded-circle mr-2"
          style={{ width: "30px", height: "30px" }}
          src={imgLogo}
          alt="User avatar"
        />

        <span className="text-dark font-weight-bold">
          {userSelecionado.nome}
        </span>
        <button
          onClick={onBack}
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

      <div
        className="mt-4 chat-container"
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "10px", // para evitar que a última mensagem fique oculta
        }}
      >
        {listMensagens.map((mensagem, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                mensagem.idUsuarioRemetente === userAtual.id
                  ? "flex-end"
                  : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                maxWidth: "100%",
                padding: "10px",
                borderRadius: "5px",
                color: "#fff",
                backgroundColor:
                  mensagem.idUsuarioRemetente === userAtual.id
                    ? "#007bff" // Cor para mensagens enviadas
                    : "#28a745", // Cor para mensagens recebidas
              }}
            >
              {mensagem.texto}
              <div style={{ fontSize: '10px' }}>{formatDate(mensagem.dataEnvio)}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body mb-2 pb-2" style={{ display: "flex" }}>
          <input
            className="form-control text-small"
            id="postTitleInput"
            type="text"
            placeholder="Digite sua mensagem..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyDown={handleKeyPress}
            required
            style={{ flex: 1 }}
          />
        </div>
      </form>
    </div>
  );
};

export default UserDetails;
