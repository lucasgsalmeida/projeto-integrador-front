import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import "./App.css";
import Projetos from "./pages/projetos/Projetos";
import { ContextLogin } from "./context/LoginContext";
import { useContext } from "react";
import NovoProjeto from "./pages/projetos/novoprojeto/NovoProjeto";
import EditarProjeto from "./pages/projetos/editarprojeto/EditarProjeto";
import Departamento from "./pages/departamento/Departamento";
import NovoDepartamento from "./pages/departamento/novodepartamento/NovoDepartamento";
import EditarDepartamento from "./pages/departamento/editardepartamento/EditarDepartamento";
import Tarefas from "./pages/tarefas/Tarefas";
import NovaTarefa from "./pages/tarefas/novatarefa/NovaTarefa";
import MinhasTarefas from "./pages/tarefas/minhas-tarefas/MinhasTarefas";

function App() {
  const { isTokenValido } = useContext(ContextLogin);

  return (
    <div className="app-container">
      {isTokenValido}
      <div className="content">
        <Routes>
          <Route
            path="/login"
            element={isTokenValido ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={isTokenValido ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={isTokenValido ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/projetos"
            element={isTokenValido ? <Projetos /> : <Navigate to="/login" />}
          />
          <Route
            path="/projetos/novo"
            element={isTokenValido ? <NovoProjeto /> : <Navigate to="/login" />}
          />
                    <Route
            path="/projetos/:id"
            element={isTokenValido ? <EditarProjeto /> : <Navigate to="/login" />}
          />
                    <Route
            path="/departamentos"
            element={isTokenValido ? <Departamento /> : <Navigate to="/login" />}
          />
                    <Route
            path="/departamentos/novo"
            element={isTokenValido ? <NovoDepartamento /> : <Navigate to="/login" />}
          />
                    <Route
            path="/departamentos/:id"
            element={isTokenValido ? <EditarDepartamento /> : <Navigate to="/login" />}
          />
                              <Route
            path="/tarefas/list"
            element={isTokenValido ? <Tarefas /> : <Navigate to="/login" />}
          />
           <Route
            path="/tarefas/nova"
            element={isTokenValido ? <NovaTarefa /> : <Navigate to="/login" />}
          />
                     <Route
            path="/tarefas/minhas-tarefas"
            element={isTokenValido ? <MinhasTarefas /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
