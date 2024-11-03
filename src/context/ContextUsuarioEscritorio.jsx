import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';

export const ContextUserClient = createContext();

const getUserClientForlocalStorage = (key) => {
  const resultadoFinal = JSON.parse(localStorage.getItem(key));
  return resultadoFinal;
};

export const ContextUserClientProvider = ({ children }) => {
  const [dadosUsuario, setDadosUsuario] = useState(getUserClientForlocalStorage('usuario'));
  const [dadosCliente, setDadosCliente] = useState(getUserClientForlocalStorage('cliente'));

  const requestContextUserClient = async (token) => {
    try {
      const response = await axios.get("https://apigestao.lumendigital.com.br/usuario/get/id", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;

      localStorage.setItem('usuario', JSON.stringify({ usuario: data.usuario }));
      localStorage.setItem('cliente', JSON.stringify({ cliente: data.cliente }));

      setDadosUsuario(data.usuario);
      setDadosCliente(data.cliente);
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário e cliente:", error);
      // Se você tiver um estado para lidar com erros, pode definir aqui.
      // setDadosIncorretos(true);
    }
  };

  return (
    <ContextUserClient.Provider value={{ dadosUsuario, dadosCliente, requestContextUserClient }}>
      {children}
    </ContextUserClient.Provider>
  );
};
