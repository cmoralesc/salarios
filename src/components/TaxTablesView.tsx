import { useState } from "react";
import {
  TABLA_ISR_QUINCENAL,
  TABLA_ISR_MENSUAL,
  TABLA_ISR_ANUAL,
  ISRTableRow,
  SUBSIDIO_MENSUAL_2025_TOPE,
  SUBSIDIO_MENSUAL_2025_CANTIDAD,
} from "../utils/tax-tables";
import { formatCurrency } from "../utils/format";

type TabType = "quincenal" | "mensual" | "anual" | "subsidio";

export default function TaxTablesView() {
  const [activeTab, setActiveTab] = useState<TabType>("quincenal");

  const getTableData = (): ISRTableRow[] => {
    switch (activeTab) {
      case "quincenal":
        return TABLA_ISR_QUINCENAL;
      case "mensual":
        return TABLA_ISR_MENSUAL;
      case "anual":
        return TABLA_ISR_ANUAL;
      default:
        return TABLA_ISR_QUINCENAL;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tablas de ISR y Subsidio 2025
      </h3>

      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-4">
          <button
            onClick={() => setActiveTab("quincenal")}
            className={`${
              activeTab === "quincenal"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
          >
            ISR Quincenal
          </button>
          <button
            onClick={() => setActiveTab("mensual")}
            className={`${
              activeTab === "mensual"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
          >
            ISR Mensual
          </button>
          <button
            onClick={() => setActiveTab("anual")}
            className={`${
              activeTab === "anual"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
          >
            ISR Anual
          </button>
          <button
            onClick={() => setActiveTab("subsidio")}
            className={`${
              activeTab === "subsidio"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
          >
            Subsidio Empleo
          </button>
        </nav>
      </div>

      {activeTab === "subsidio" ? (
        <div className="p-4 bg-gray-50 rounded border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-2">
            Nuevo Esquema de Subsidio al Empleo (Mayo 2024 / 2025)
          </h4>
          <p className="text-sm text-gray-700 mb-4">
            A partir del 1 de mayo de 2024, el subsidio al empleo dejó de ser
            una tabla con rangos para convertirse en una cuota fija basada en la
            UMA, aplicable a trabajadores que no excedan un límite de ingresos.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2 text-gray-800">
            <li>
              <span className="font-medium">Tope de Ingresos Mensuales:</span>{" "}
              {formatCurrency(SUBSIDIO_MENSUAL_2025_TOPE)}
            </li>
            <li>
              <span className="font-medium">Monto del Subsidio Mensual:</span>{" "}
              {formatCurrency(SUBSIDIO_MENSUAL_2025_CANTIDAD)}
              <span className="text-gray-500 text-xs ml-2">
                (13.8% de la UMA Mensual vigente)
              </span>
            </li>
            <li>
              <span className="font-medium">Regla de Aplicación:</span> Si el
              trabajador gana menos del tope, se le aplica el subsidio contra su
              ISR. Si el subsidio es mayor al ISR, el impuesto a pagar será
              cero, pero
              <span className="font-bold text-red-600">
                {" "}
                NO se entrega la diferencia en efectivo
              </span>
              .
            </li>
          </ul>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                >
                  Límite Inferior
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                >
                  Límite Superior
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cuota Fija
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                >
                  % Excedente
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getTableData().map((row, index, arr) => {
                const nextRow = arr[index + 1];
                const upperLimit = nextRow
                  ? formatCurrency(nextRow.limiteInferior - 0.01)
                  : "En adelante";

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-2 whitespace-nowrap text-gray-900">
                      {formatCurrency(row.limiteInferior)}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-gray-900">
                      {upperLimit}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-gray-900">
                      {formatCurrency(row.cuotaFija)}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-gray-900">
                      {(row.porcentaje * 100).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
