import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { fetchDepartamentos } from "../../request/DepartamentoApi";
import { fetchUsuarios } from "../../request/UsuarioApi";
import { createTipoTarefa } from "../../request/TipoTarefaApi";
import ReactQuill from "react-quill";

const DraggableDepartamento = ({
  departamento,
  index,
  moveDepartamento,
  removeDepartamentoLista,
  updateQtdDias,
  getNomeDepartamento
}) => {
  const [{ isDragging }, ref] = useDrag({
    type: "departamento",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "departamento",
    hover(item) {
      if (item.index !== index) {
        moveDepartamento(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`mb-4 shadow py-2 ml-2 mt-4 p-2${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="card-header text-gray-900 d-flex justify-content-between align-items-center">
        {departamento.nome}
        <a
          onClick={() => removeDepartamentoLista(departamento)}
          className="btn btn-primary btn-icon-split shadow"
        >
          <span className="icon text-white-50">
            <i className="fas fa-minus" />
          </span>
        </a>
      </div>
      <div className="card-body">
        <input
          className="form-control border-left-primary"
          type="number"
          placeholder="Quantidade de dias"
          value={departamento.qtdDias || ""}
          onChange={(e) => updateQtdDias(index, Number(e.target.value))}
          required
        />
      </div>
    </div>
  );
};

const CriarTipoTarefa = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentoOrdem, setDepartamentoOrdem] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [responsaveis, setResponsaveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getNomeDepartamento = (idDepartamento) => {
    if (departamentos.length === 0) {
      return "Carregando...";
    }
    
    const departamento = departamentos.find(
      (departamento) => departamento.id === idDepartamento
    );
    return departamento ? departamento.nome : "Desconhecido";
  };

  const addDepartamentoLista = (e) => {
    const selectedId = Number(e);
    const selectedDepartamento = departamentos.find(
      (dep) => dep.id === selectedId
    );

    if (selectedDepartamento) {
      setDepartamentoOrdem((prevOrdem) => [
        ...prevOrdem,
        { ...selectedDepartamento, idInterno: Math.random(), qtdDias: 0 }, // idInterno para controle interno
      ]);
    } else {
      console.log("Departamento não encontrado.");
    }
  };

  const removeDepartamentoLista = (departamento) => {
    const filteredDepartamentos = departamentoOrdem.filter(
      (dep) => dep.idInterno !== departamento.idInterno
    );

    setDepartamentoOrdem(filteredDepartamentos);
  };

  const updateQtdDias = (index, qtdDias) => {
    const updatedDepartamentos = [...departamentoOrdem];
    updatedDepartamentos[index].qtdDias = qtdDias;
    setDepartamentoOrdem(updatedDepartamentos);
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "link",
    "list",
    "bullet",
    "indent",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDepartamentos = await fetchDepartamentos();
        setDepartamentos(fetchedDepartamentos);

        const fetchedUsuarios = await fetchUsuarios();
        setResponsaveis(fetchedUsuarios);
      } catch (error) {
        setError("Erro ao buscar dados.");
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const moveDepartamento = (fromIndex, toIndex) => {
    const updatedOrdem = [...departamentoOrdem];
    const [movedDepartamento] = updatedOrdem.splice(fromIndex, 1);
    updatedOrdem.splice(toIndex, 0, movedDepartamento);
    setDepartamentoOrdem(updatedOrdem);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tipoTarefa = {
        nome,
        descricao,
        responsavelDepartamentoProjetos: departamentoOrdem.map((d, index) => ({
          idDepartamento: d.id,
          ordem: index + 1,
          qtdDias: d.qtdDias,
        })),
      };

      console.log(departamentoOrdem);

      await createTipoTarefa(tipoTarefa);

      setNome("");
      setDescricao("");
      setDepartamentoOrdem([]); // Limpa a lista após a criação
      navigate("/tarefas/modelo");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar tipo de tarefa");
    }
  };

  return (
    <Layout>
      <div id="layoutSidenav_content">
        <main>
          <header className="page-header page-header-compact page-header-light border-bottom mb-4">
            <div className="container-fluid px-4">
              <div className="page-header-content">
                <div className="row align-items-center justify-content-between pt-3">
                  <div className="col-auto mb-3">
                    <h1 className="h3 mb-0 text-gray-800">
                      Criar Modelo de Tarefa
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="container-fluid px-4">
              <div className="row gx-4">
                <div className="col-lg-8">
                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header text-gray-900">
                      Nome do projeto
                    </div>
                    <div className="card-body">
                      <input
                        className="form-control border-left-primary"
                        id="postTitleInput"
                        type="text"
                        placeholder="Digite o nome do projeto..."
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-4 border-left-primary shadow py-2 mb-2">
                    <div className="card-header text-gray-900">
                      Descreva a tarefa
                    </div>
                    <div className="card-body">
                      <ReactQuill
                        value={descricao}
                        onChange={setDescricao}
                        modules={modules}
                        formats={formats}
                      />
                    </div>
                  </div>
                  <DndProvider backend={HTML5Backend}>
                    <div className="mb-4 border-left-primary shadow py-2 mb-2">
                      <div className="card-header text-gray-900 d-flex justify-content-between align-items-center">
                        Selecione os Departamentos
                        <select
                          className="btn btn-primary btn-icon-split w-25"
                          onChange={(e) => {
                            const value = e.target.value;
                            addDepartamentoLista(value);
                            e.target.value = "";
                          }}
                        >
                    
                          <option value="" className="">
                            Adicionar novo
                          </option>
                          {departamentos.map((departamento) => (
                            <option
                              key={departamento.id}
                              value={departamento.id}
                            >
                              {departamento.nome}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="p-2">
                        {departamentoOrdem.map((departamento, index) => (
                          <DraggableDepartamento
                            key={departamento.idInterno}
                            index={index}
                            departamento={departamento}
                            moveDepartamento={moveDepartamento}
                            removeDepartamentoLista={removeDepartamentoLista}
                            getNomeDepartamento={getNomeDepartamento}
                            updateQtdDias={updateQtdDias} // Passa a função para atualizar qtdDias
                          />
                        ))}
                      </div>
                    </div>
                  </DndProvider>
                </div>
                <div className="mb-4 border-left-primary shadow pr-4 h-100">
                  <div className="card-header">
                    Publicar
                    <i
                      className="text-muted"
                      data-feather="info"
                      data-bs-toggle="tooltip"
                      data-bs-placement="left"
                      title=""
                    />
                  </div>

                  <div className="card-body">
                    <div className="d-grid">
                      <button className="btn btn-primary" type="submit">
                        Salvar modelo de tarefas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
};

export default CriarTipoTarefa;