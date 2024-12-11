import axios from 'axios';

const API_URL = 'https://apigestao.lumendigital.com.br';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${tokenData.token}`
  };
};

export const fetchEscritorio = async () => {
    try {
      const response = await axios.get(`${API_URL}/escritorio`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar escritório.');
    }
  };