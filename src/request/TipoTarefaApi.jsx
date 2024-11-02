import axios from 'axios';

const API_URL = 'http://localhost:8080';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${tokenData.token}`
  };
};

export const fetchTipoTarefas = async () => {
  try {
    const response = await axios.get(`${API_URL}/modelo/get/all`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar tipo de tarefas.');
  }
};

export const fetchTipoTarefaById = async (idTipoTarefa) => {
  if (!idTipoTarefa) {
    throw new Error('ID de tipo de tarefa inválido.');
  }

  try {
    const response = await axios.get(`${API_URL}/modelo/get?id=${idTipoTarefa}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar tipo de tarefa.');
  }
};

export const createTipoTarefa = async (tipoTarefa) => {
  try {
    const response = await axios.post(`${API_URL}/modelo/create`, tipoTarefa, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar tipo de tarefa.');
  }
  
};

export const updateTipoTarefa = async (id, tipoTarefa) => {
  try {
    const response = await axios.put(`${API_URL}/modelo/update/${id}`, tipoTarefa, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar tipo de tarefa.');
  }
};

export const deleteTipoTarefa = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/modelo/delete/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar tipo de tarefa.');
  }
};
