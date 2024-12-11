import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${tokenData.token}`
  };
};

export const fetchDepartamentos = async () => {
  try {
    const response = await axios.get(`${API_URL}/departamento/get/all`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar departamentos.');
  }
};

// Função para buscar um departamento por ID
export const fetchDepartamentoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/departamento/get?id=${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao buscar departamento com ID ${id}.`);
  }
};

// Função para criar um novo departamento
export const createDepartamento = async (departamentoData) => {
  try {
    await axios.post(`${API_URL}/departamento/new`, departamentoData, {
      headers: getAuthHeader()
    });

    return await fetchDepartamentos();
  } catch (error) {
    throw new Error('Erro ao criar departamento: ' + error.message);
  }
};

export const updateDepartamento = async (id, departamentoData) => {
  try {
    await axios.put(`${API_URL}/departamento/update/${id}`, departamentoData, {
      headers: getAuthHeader()
    });

    return await fetchDepartamentos();
  } catch (error) {
    throw new Error('Erro ao atualizar departamento: ' + error.message);
  }
};

export const deleteDepartamento = async (id) => {
  try {
    await axios.delete(`${API_URL}/departamento/delete/${id}`, {
      headers: getAuthHeader()
    });

    return await fetchDepartamentos();
  } catch (error) {
    throw new Error('Erro ao deletar departamento: ' + error.message);
  }
};

