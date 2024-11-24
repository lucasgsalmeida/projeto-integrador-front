import React from "react";
import ListKanban from "../../components/dashboard/ListKanban";

const Kanban = () => {
  return (
    <div className="mt-5">
      <h1 className="h4 mb-4 text-gray-800">Status das tarefas em andamento</h1>

      <ListKanban />
    </div>
  );
};

export default Kanban;
