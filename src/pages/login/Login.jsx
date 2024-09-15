import React, { useState, useContext, useEffect } from "react";
import { ContextLogin } from "../../context/LoginContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginApi, isTokenValido } = useContext(ContextLogin); // Função de login do contexto
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const loginSuccess = await loginApi({ email, senha });
    if (loginSuccess) {
      navigate('/home');
    }
  };

  useEffect(() => {
    if (isTokenValido) {
      navigate('/'); // Redireciona para a página principal após o login
    }
  }, [isTokenValido, navigate]); // O useEffect vai disparar sempre que isTokenValido mudar

  return (
    <div className="bg-gradient-primary d-flex align-items-center justify-content-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-10">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-0">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">
                      Bem vindo ao Gestão 10x!
                    </h1>
                  </div>
                  <form className="user" onSubmit={handleLogin}>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control form-control-user"
                        id="exampleInputEmail"
                        aria-describedby="emailHelp"
                        placeholder="Digite seu usuário de acesso..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleInputPassword"
                        placeholder="Digite sua senha..."
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-user btn-block"
                    >
                      Fazer login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
