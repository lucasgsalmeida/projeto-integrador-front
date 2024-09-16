import axios from 'axios';

const API_URL = 'http://localhost:8080';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${tokenData.token}`
  };
};

// Função para buscar todos os departamentos
export const fetchDepartamentos = async () => {
  try {
    const response = await axios.get(`${API_URL}/departamento/get/all`, {
      headers: getAuthHeader()
    });
    const departamentosData = response.data;
    localStorage.setItem('departamentos', JSON.stringify(departamentosData));
    return departamentosData;
  } catch (error) {
    throw new Error('Erro ao buscar departamentos.');
  }
};

// Função para buscar um departamento por ID
export const fetchDepartamentoById = async (id) => {
  try {
    const storedDepartamentos = localStorage.getItem('departamentos');

    if (storedDepartamentos) {
      const departamentos = JSON.parse(storedDepartamentos);
      const departamento = departamentos.find(depto => depto.id === id);
      if (departamento) {
        return departamento;
      }
    }

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
    // Envia a requisição para criar um novo departamento
    await axios.post(`${API_URL}/departamento/new`, departamentoData, {
      headers: getAuthHeader()
    });

    // Atualiza o localStorage com a lista atualizada
    fetchDepartamentos().then(departamentos => {
      localStorage.setItem('departamentos', JSON.stringify(departamentos));
    });

  } catch (error) {
    throw new Error('Erro ao criar departamento: ' + error.message);
  }
};

export const updateDepartamento = async (departamentoData) => {
  try {
    // Envia a requisição para atualizar um departamento
    await axios.put(`${API_URL}/departamento/update`, departamentoData, {
      headers: getAuthHeader()
    });

    // Atualiza o localStorage com a lista atualizada
    fetchDepartamentos().then(departamentos => {
      localStorage.setItem('departamentos', JSON.stringify(departamentos));
    });

  } catch (error) {
    throw new Error('Erro ao atualizar departamento: ' + error.message);
  }
};

