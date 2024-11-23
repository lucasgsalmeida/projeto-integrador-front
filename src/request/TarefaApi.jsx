import axios from 'axios';

const API_URL = 'https://apigestao.lumendigital.com.br';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${tokenData.token}`
  };
};

export const fetchTarefasPorUsuario = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tarefa/get/abertas?id=${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar tarefas.');
  }
};

export const fetchTarefasPorAprovacao = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/tarefa/get/aprovacao?id=${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar tarefas.');
  }
};


export const fetchTarefasAbertas = async () => {
  try {
    const response = await axios.get(`${API_URL}/tarefa/get/all/abertas`, {
      headers: getAuthHeader()
    });
    console.log("aa")
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar tarefas.');
  }
};

export const fetchTarefasFechadas = async () => {
  try {
    const response = await axios.get(`${API_URL}/tarefa/get/all/fechadas`, {
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

export const atualizarTarefa = async (id, TarefaData) => {
  try {
    const response = await axios.put(`${API_URL}/tarefa/update/${id}`, TarefaData, {
      headers: getAuthHeader()
    });
    console.log(response)
    return response.data;
  } catch (error) {
    throw new Error('Erro ao atualizar Tarefa.');
  }
};

