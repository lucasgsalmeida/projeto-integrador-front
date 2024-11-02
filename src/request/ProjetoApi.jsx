import axios from 'axios';

const API_URL = 'http://localhost:8080';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${tokenData.token}`
  };
};

export const fetchProjetos = async () => {
  try {
    const response = await axios.get(`${API_URL}/projeto/get/all`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar projetos.');
  }
};

export const fetchProjetoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/projeto/get?id=${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao buscar projeto com ID ${id}.`);
  }
};

// Função para criar um novo projeto
export const createProjeto = async (projetoData) => {
  try {
    const response = await axios.post(`${API_URL}/projeto/new`, projetoData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar projeto.');
  }
};

export const atualizarProjeto = async (id, projetoData) => {
  try {
    const response = await axios.put(`${API_URL}/projeto/update/${id}`, projetoData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar projeto.');
  }
};

export const deleteProjeto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/projeto/delete/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar projeto.');
  }
};
