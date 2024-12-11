import axios from 'axios';

const API_URL = window.env.REACT_APP_API_URL || 'http://localhost:8080';

const getAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem('token'));
  return {
    Authorization: `Bearer ${tokenData.token}`
  };
};

// Salvar mensagem no estado local
export const saveMensagem = (mensagem, setMensagens) => {
  setMensagens(prevMensagens => [...prevMensagens, mensagem]);
};

// Buscar mensagens entre dois usuários, sem cache no localStorage
export const getMensagens = async (idRemetente, idDestinatario) => {
  try {
    const response = await axios.get(
      `${API_URL}/mensagem/get?remetente=${idRemetente}&destinatario=${idDestinatario}`, 
      {
        headers: getAuthHeader(),
      }
    );
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
