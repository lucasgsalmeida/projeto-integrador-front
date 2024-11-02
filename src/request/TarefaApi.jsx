import axios from 'axios';

const API_URL = 'http://localhost:8080';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${tokenData.token}`
  };
};

export const fetchTarefasPorUsuario = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tarefa/get?id=${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar tarefas.');
  }
};


// Função para buscar todas as tarefas
export const fetchTarefas = async () => {
  try {
    const response = await axios.get(`${API_URL}/tarefa/get/all`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar tarefas.');
  }
};

// Função para criar uma nova tarefa
export const createTarefa = async (tarefaData) => {
  try {
    const response = await axios.post(
      `${API_URL}/tarefa/create`,
      tarefaData,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar tarefa.');
  }
};

