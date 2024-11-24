import React from "react";
import ListVencimento from "../../components/dashboard/ListVencimentos";

const ParaHoje = () => {
  return (
    <div className="mt-5">
      <h1 className="h4 mb-4 text-gray-800">Resumo de vencimentos</h1>

    <ListVencimento/>
    </div>
  );
};

export default ParaHoje;
