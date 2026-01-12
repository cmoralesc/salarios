import React from "react";

interface Props {
  year?: number;
}

export default function ImssCalculationExplanation({ year = 2025 }: Props) {
  const is2026 = year === 2026;
  const umaValue = is2026 ? "117.31" : "113.14";

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Metodología de Cálculo IMSS {year}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-800">
          Desglose de cuotas obrero-patronales y bases de cotización utilizadas.
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {/* Conceptos Básicos */}
        <div className="mb-8">
          <h4 className="text-md font-bold text-gray-900 mb-2">
            Conceptos Clave
          </h4>
          <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
            <li>
              <strong>SBC (Salario Base de Cotización):</strong> Es el Salario
              Diario Integrado (SDI) topeado a 25 UMAs.
            </li>
            <li>
              <strong>UMA (Unidad de Medida y Actualización):</strong>{" "}
              Referencia económica (${umaValue} MXN en {year}).
            </li>
            <li>
              <strong>Cuota Fija Patronal:</strong> 20.40% aplicado sobre 1 UMA
              diaria por cada día cotizado.
            </li>
            <li>
              <strong>Excedente (3 UMA):</strong> Cuota adicional si el SBC
              supera 3 veces la UMA.
            </li>
          </ul>
        </div>

        {/* Tabla de Porcentajes */}
        <div className="mb-8">
          <h4 className="text-md font-bold text-gray-900 mb-4">
            Tabla de Cuotas y Porcentajes
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left font-medium text-gray-900 uppercase tracking-wider border-r"
                  >
                    Seguro
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Concepto
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left font-medium text-gray-900 uppercase tracking-wider"
                  >
                    Base
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left font-medium text-blue-800 uppercase tracking-wider"
                  >
                    Patrón (%)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left font-medium text-green-800 uppercase tracking-wider"
                  >
                    Trabajador (%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Enfermedades y Maternidad */}
                <tr>
                  <td
                    className="px-4 py-4 font-medium text-gray-900 bg-gray-50 border-r align-top"
                    rowSpan={4}
                  >
                    Enf. y Maternidad
                  </td>
                  <td className="px-4 py-4 text-gray-900">Cuota Fija</td>
                  <td className="px-4 py-4 text-gray-800">UMA</td>
                  <td className="px-4 py-4 text-gray-900">20.40%</td>
                  <td className="px-4 py-4 text-gray-900">-</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-gray-900">Excedente (3 UMA)</td>
                  <td className="px-4 py-4 text-gray-800">
                    Diferencia (SBC - 3 UMA)
                  </td>
                  <td className="px-4 py-4 text-gray-900">1.10%</td>
                  <td className="px-4 py-4 text-gray-900">0.40%</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-gray-900">
                    Prestaciones en Dinero
                  </td>
                  <td className="px-4 py-4 text-gray-800">SBC</td>
                  <td className="px-4 py-4 text-gray-900">0.70%</td>
                  <td className="px-4 py-4 text-gray-900">0.25%</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-gray-900">
                    Gastos Médicos Pensionados
                  </td>
                  <td className="px-4 py-4 text-gray-800">SBC</td>
                  <td className="px-4 py-4 text-gray-900">1.05%</td>
                  <td className="px-4 py-4 text-gray-900">0.375%</td>
                </tr>

                {/* Riesgos de Trabajo */}
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-4 font-medium text-gray-900 bg-gray-50 border-r align-top">
                    Riesgos de Trabajo
                  </td>
                  <td className="px-4 py-4 text-gray-900">Cuota Patronal</td>
                  <td className="px-4 py-4 text-gray-800">SBC</td>
                  <td className="px-4 py-4 text-gray-900">0.54355% (Mínimo)</td>
                  <td className="px-4 py-4 text-gray-900">-</td>
                </tr>

                {/* Invalidez y Vida */}
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-4 font-medium text-gray-900 bg-gray-50 border-r align-top">
                    Invalidez y Vida
                  </td>
                  <td className="px-4 py-4 text-gray-900">Invalidez y Vida</td>
                  <td className="px-4 py-4 text-gray-800">SBC</td>
                  <td className="px-4 py-4 text-gray-900">1.75%</td>
                  <td className="px-4 py-4 text-gray-900">0.625%</td>
                </tr>

                {/* Guarderías */}
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-4 font-medium text-gray-900 bg-gray-50 border-r align-top">
                    Guarderías
                  </td>
                  <td className="px-4 py-4 text-gray-900">
                    Guarderías y Prest. Soc.
                  </td>
                  <td className="px-4 py-4 text-gray-800">SBC</td>
                  <td className="px-4 py-4 text-gray-900">1.00%</td>
                  <td className="px-4 py-4 text-gray-900">-</td>
                </tr>

                {/* RCV */}
                <tr className="border-t border-gray-200">
                  <td
                    className="px-4 py-4 font-medium text-gray-900 bg-gray-50 border-r align-top"
                    rowSpan={2}
                  >
                    Retiro, Cesantía y Vejez
                  </td>
                  <td className="px-4 py-4 text-gray-900">Retiro</td>
                  <td className="px-4 py-4 text-gray-800">SBC</td>
                  <td className="px-4 py-4 text-gray-900">2.00%</td>
                  <td className="px-4 py-4 text-gray-900">-</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 text-gray-900">Cesantía y Vejez</td>
                  <td className="px-4 py-4 text-gray-800">SBC</td>
                  <td className="px-4 py-4 font-bold text-indigo-700">
                    Progresivo (Ver Tabla)
                  </td>
                  <td className="px-4 py-4 text-gray-900">1.125%</td>
                </tr>

                {/* Infonavit */}
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900 border-r align-top">
                    Vivienda
                  </td>
                  <td className="px-4 py-4 text-gray-900">Infonavit</td>
                  <td className="px-4 py-4 text-gray-800">SBC</td>
                  <td className="px-4 py-4 text-gray-900">5.00%</td>
                  <td className="px-4 py-4 text-gray-900">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla Cesantía Patronal Progresiva */}
        <div>
          <h4 className="text-md font-bold text-gray-900 mb-2">
            Cuota Patronal Progresiva: Cesantía y Vejez ({year})
          </h4>
          <p className="text-sm text-gray-800 mb-4">
            Según reforma al sistema de pensiones (Artículo Segundo
            Transitorio), vigente a partir de 2023 con incremento gradual hasta
            2030. Valores para {year}:
          </p>
          <div className="overflow-x-auto max-w-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-medium text-gray-900"
                  >
                    Salario Base (SBC)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left font-medium text-indigo-800"
                  >
                    Cuota Patronal {year}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-gray-800">Salario Mínimo</td>
                  <td className="px-4 py-2 text-gray-900">3.150%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-800">
                    1.01 SM a 1.50 UMA
                  </td>
                  <td className="px-4 py-2 text-gray-900">{is2026 ? "3.843%" : "3.544%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-800">1.51 a 2.00 UMA</td>
                  <td className="px-4 py-2 text-gray-900">{is2026 ? "5.193%" : "4.426%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-800">2.01 a 2.50 UMA</td>
                  <td className="px-4 py-2 text-gray-900">{is2026 ? "6.001%" : "4.954%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-800">2.51 a 3.00 UMA</td>
                  <td className="px-4 py-2 text-gray-900">{is2026 ? "6.540%" : "5.307%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-800">3.01 a 3.50 UMA</td>
                  <td className="px-4 py-2 text-gray-900">{is2026 ? "6.925%" : "5.559%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-800">3.51 a 4.00 UMA</td>
                  <td className="px-4 py-2 text-gray-900">{is2026 ? "7.214%" : "5.747%"}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-gray-800">
                    4.01 UMA en adelante
                  </td>
                  <td className="px-4 py-2 text-gray-900">{is2026 ? "8.241%" : "6.422%"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
