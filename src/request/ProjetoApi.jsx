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
    const storedProjetos = localStorage.getItem('projetos');
    
    if (storedProjetos) {
      return JSON.parse(storedProjetos);
    } else {
      const response = await axios.get(`${API_URL}/projeto/get/all`, {
        headers: getAuthHeader()
      });
      const projetosData = response.data;
      localStorage.setItem('projetos', JSON.stringify(projetosData));
      return projetosData;
    }
  } catch (error) {
    throw new Error('Erro ao buscar projetos.');
  }
};

export const fetchProjetoById = async (id) => {
  try {
    const storedProjetos = localStorage.getItem('projetos');

    if (storedProjetos) {
      const projetos = JSON.parse(storedProjetos);
      const projeto = projetos.find(projeto => projeto.id === id);
      if (projeto) {
        return projeto;
      }
    }

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

export const atualizarProjeto = async (projetoData) => {
  try {
    const response = await axios.put(`${API_URL}/projeto/update`, projetoData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar projeto.');
  }
};

