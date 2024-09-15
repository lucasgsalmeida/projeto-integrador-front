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
    const storedTipoTarefas = localStorage.getItem('tipoTarefas');
    
    if (storedTipoTarefas) {
      return JSON.parse(storedTipoTarefas);
    } else {
      const response = await axios.get(`${API_URL}/modelo/get/all`, {
        headers: getAuthHeader()
      });
      const tipoTarefasData = response.data;
      localStorage.setItem('tipoTarefas', JSON.stringify(tipoTarefasData));
      return tipoTarefasData;
    }
  } catch (error) {
    throw new Error('Erro ao buscar tipoTarefas.');
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
    const createdTipoTarefa = response.data;

    // Atualizar cache local
    const storedTipoTarefas = localStorage.getItem('tipoTarefas');
    let tipoTarefas = storedTipoTarefas ? JSON.parse(storedTipoTarefas) : [];
    tipoTarefas.push(createdTipoTarefa);
    localStorage.setItem('tipoTarefas', JSON.stringify(tipoTarefas));

    return createdTipoTarefa;
  } catch (error) {
    throw new Error('Erro ao criar tipo de tarefa.');
  }
};
