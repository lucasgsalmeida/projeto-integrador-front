import React, { useState } from "react";
import imgLogo from "../../../imgs/undraw_profile.svg";
import { createMensagem } from "../../../request/ChatApi";

const UserDetails = ({ userAtual, userSelecionado, onBack }) => {
  const [mensagem, setMensagem] = useState("");

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

      console.log(mensagemData)

      await createMensagem(mensagemData);
      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="mt-0 p-2 bg-white border rounded">
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

      <div className="mt-4">
        <form onSubmit={handleSubmit}>
          <div className="card-body p-0 m-0">
            <input
              className="form-control text-small"
              id="postTitleInput"
              type="text"
              placeholder="Digite sua mensagem..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={handleKeyPress} // Dispara ao pressionar Enter
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
