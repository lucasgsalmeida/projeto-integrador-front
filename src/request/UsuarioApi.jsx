import axios from "axios";

const API_URL = window.env.REACT_APP_API_URL || 'http://localhost:8080';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  return {
    Authorization: `Bearer ${tokenData.token}`,
  };
};

// Função para verificar o token
export const verifyToken = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/usuario/verify-token`,
      {},
      {
        headers: getAuthHeader(),
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Token inválido");
    }
  } catch (error) {
    throw new Error("Erro ao verificar o token");
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const response = await axios.post(`${API_URL}/usuario/new`, usuarioData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Erro ao criar usuário.");
  }
};

// Função para login
export const login = async (dadosLogin) => {
  try {
    const response = await axios.post(
      `${API_URL}/usuario/login`,
      {
        usuario: dadosLogin.email,
        senha: dadosLogin.senha,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.token) {
      return response.data;
    } else {
      throw new Error("Falha no login");
    }
  } catch (error) {
    throw new Error("Erro no login");
  }
};

export const fetchUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuario/get/all`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar usuários.");
  }
};

// Função para encontrar um usuário por ID
export const findUsuarioById = (id, usuarios) => {
  if (!usuarios || usuarios.length === 0) {
    console.error("Lista de usuários está vazia");
    return null;
  }
  const usuario = usuarios.find((user) => user.id === parseInt(id, 10));
  if (!usuario) {
    console.error(`Usuário com ID ${id} não encontrado`);
  }
  return usuario;
};

export const getUsuarioFromLocalStorage = () => {
  const usuario = localStorage.getItem("usuario");
  if (usuario) {
    return JSON.parse(usuario);
  }
  return null;
};
