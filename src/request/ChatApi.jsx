import axios from 'axios';

const API_URL = 'https://apigestao.lumendigital.com.br';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${tokenData.token}`
  };
};

export const getMensagens = async (idRemetente, idDestinatario) => {
    try {
      const response = await axios.get(`${API_URL}/mensagem/get?remetente=${idRemetente}&destinatario=${idDestinatario}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar mensagens.');
    }
  };

  export const createMensagem = async (mensagemData) => {
    try {
      const response = await axios.post(`${API_URL}/mensagem/new`, mensagemData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar mensagem.');
    }
  };
  