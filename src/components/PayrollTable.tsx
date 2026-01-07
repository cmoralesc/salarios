import { PayrollPeriod } from "../utils/nominas";
import { formatCurrency } from "../utils/format";

interface PayrollTableProps {
  periods: PayrollPeriod[];
}

export default function PayrollTable({ periods }: PayrollTableProps) {
  const totals = periods.reduce(
    (acc, period) => ({
      grossSalary: acc.grossSalary + period.grossSalary,
      exemptIncome: acc.exemptIncome + period.exemptIncome,
      taxableIncome: acc.taxableIncome + period.taxableIncome,
      isr: acc.isr + period.isr,
      subsidioEmpleo: acc.subsidioEmpleo + period.subsidioEmpleo,
      imssEmployee: acc.imssEmployee + period.imssEmployee,
      netSalary: acc.netSalary + period.netSalary,
      imssEmployer: acc.imssEmployer + period.imssEmployer,
      infonavitEmployer: acc.infonavitEmployer + period.infonavitEmployer,
      isn: acc.isn + period.isn,
      totalEmployerCost: acc.totalEmployerCost + period.totalEmployerCost,
      // Desglose Obrero
      enfMat:
        acc.enfMat +
        period.imssBreakdown.employee.gastosMedicos +
        period.imssBreakdown.employee.prestacionesDinero +
        period.imssBreakdown.employee.excedente,
      invVida: acc.invVida + period.imssBreakdown.employee.invalidezVida,
      cesantia: acc.cesantia + period.imssBreakdown.employee.cesantia,
      // Desglose Patronal
      patCuotaFija: acc.patCuotaFija + period.imssBreakdown.employer.cuotaFija,
      patEnfMat:
        acc.patEnfMat +
        period.imssBreakdown.employer.excedente +
        period.imssBreakdown.employer.prestacionesDinero +
        period.imssBreakdown.employer.gastosMedicos,
      patRiesgo: acc.patRiesgo + period.imssBreakdown.employer.riesgoTrabajo,
      patInvVida: acc.patInvVida + period.imssBreakdown.employer.invalidezVida,
      patGuarderias:
        acc.patGuarderias + period.imssBreakdown.employer.guarderias,
      patRetiro: acc.patRetiro + period.imssBreakdown.employer.retiro,
      patCesantia: acc.patCesantia + period.imssBreakdown.employer.cesantia,
    }),
    {
      grossSalary: 0,
      exemptIncome: 0,
      taxableIncome: 0,
      isr: 0,
      subsidioEmpleo: 0,
      imssEmployee: 0,
      netSalary: 0,
      imssEmployer: 0,
      infonavitEmployer: 0,
      isn: 0,
      totalEmployerCost: 0,
      enfMat: 0,
      invVida: 0,
      cesantia: 0,
      patCuotaFija: 0,
      patEnfMat: 0,
      patRiesgo: 0,
      patInvVida: 0,
      patGuarderias: 0,
      patRetiro: 0,
      patCesantia: 0,
    }
  );

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mt-6">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3 sticky left-0 bg-gray-50 z-10">
              Periodo
            </th>
            <th scope="col" className="px-3 py-3 bg-blue-50">
              Sueldo Bruto
            </th>
            <th scope="col" className="px-3 py-3 text-gray-500 bg-gray-50">
              Ingresos Exentos
            </th>
            <th scope="col" className="px-3 py-3 text-gray-700 bg-blue-50">
              Ingresos Gravados
            </th>
            <th scope="col" className="px-3 py-3 text-red-600 bg-blue-50">
              ISR
            </th>
            <th scope="col" className="px-3 py-3 text-green-600 bg-blue-50">
              Subsidio
            </th>
            <th scope="col" className="px-3 py-3 text-red-600 bg-blue-50">
              IMSS (Obrero) Total
            </th>

            {/* Desglose IMSS Obrero */}
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Enf. y Mat.
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Inv. y Vida
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Cesantía
            </th>

            <th
              scope="col"
              className="px-3 py-3 font-bold text-green-700 bg-green-50 border-l-2 border-green-200"
            >
              Neto a Pagar
            </th>
            <th
              scope="col"
              className="px-3 py-3 bg-orange-50 border-l-2 border-orange-200"
            >
              IMSS Patronal Total
            </th>

            {/* Desglose IMSS Patronal */}
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Cuota Fija
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Enf. y Mat.
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Riesgo Trab.
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Inv. y Vida
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Guarderías
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Retiro
            </th>
            <th
              scope="col"
              className="px-2 py-3 text-xs text-gray-500 bg-gray-50"
            >
              Cesantía
            </th>
            <th scope="col" className="px-3 py-3 bg-orange-50">
              Infonavit
            </th>
            <th scope="col" className="px-3 py-3 bg-orange-50">
              ISN (4%)
            </th>
            <th
              scope="col"
              className="px-3 py-3 font-bold text-orange-800 bg-orange-100"
            >
              Costo Total
            </th>
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr
              key={period.periodNumber}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-3 py-4 font-medium text-gray-900 sticky left-0 bg-white">
                {period.label}
                {period.isAguinaldo && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                    Aguinaldo
                  </span>
                )}
                {period.isPrimaVacacional && (
                  <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-1 rounded">
                    Prima Vac.
                  </span>
                )}
              </td>
              <td className="px-3 py-4">
                {formatCurrency(period.grossSalary)}
              </td>
              <td className="px-3 py-4 text-gray-500">
                {formatCurrency(period.exemptIncome)}
              </td>
              <td className="px-3 py-4 text-gray-700 font-medium">
                {formatCurrency(period.taxableIncome)}
              </td>
              <td className="px-3 py-4 text-red-600">
                {formatCurrency(period.isr)}
              </td>
              <td className="px-3 py-4 text-green-600">
                {formatCurrency(period.subsidioEmpleo)}
              </td>
              <td className="px-3 py-4 text-red-600 font-medium">
                {formatCurrency(period.imssEmployee)}
              </td>

              {/* Desglose IMSS Obrero */}
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(
                  period.imssBreakdown.employee.gastosMedicos +
                    period.imssBreakdown.employee.prestacionesDinero +
                    period.imssBreakdown.employee.excedente
                )}
              </td>
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(period.imssBreakdown.employee.invalidezVida)}
              </td>
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(period.imssBreakdown.employee.cesantia)}
              </td>

              <td className="px-3 py-4 font-bold text-green-700 bg-green-50 border-l-2 border-green-100">
                {formatCurrency(period.netSalary)}
              </td>
              <td className="px-3 py-4 bg-orange-50 border-l-2 border-orange-100">
                {formatCurrency(period.imssEmployer)}
              </td>

              {/* Desglose IMSS Patronal */}
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(period.imssBreakdown.employer.cuotaFija)}
              </td>
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(
                  period.imssBreakdown.employer.excedente +
                    period.imssBreakdown.employer.prestacionesDinero +
                    period.imssBreakdown.employer.gastosMedicos
                )}
              </td>
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(period.imssBreakdown.employer.riesgoTrabajo)}
              </td>
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(period.imssBreakdown.employer.invalidezVida)}
              </td>
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(period.imssBreakdown.employer.guarderias)}
              </td>
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(period.imssBreakdown.employer.retiro)}
              </td>
              <td className="px-2 py-4 text-xs text-gray-500">
                {formatCurrency(period.imssBreakdown.employer.cesantia)}
              </td>
              <td className="px-3 py-4 bg-orange-50">
                {formatCurrency(period.infonavitEmployer)}
              </td>
              <td className="px-3 py-4 bg-orange-50">
                {formatCurrency(period.isn)}
              </td>
              <td className="px-3 py-4 font-bold text-orange-800 bg-orange-100">
                {formatCurrency(period.totalEmployerCost)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-bold text-gray-900 border-t-2 border-gray-300">
          <tr>
            <td className="px-3 py-4 sticky left-0 bg-gray-100">TOTAL</td>
            <td className="px-3 py-4">{formatCurrency(totals.grossSalary)}</td>
            <td className="px-3 py-4 text-gray-500">
              {formatCurrency(totals.exemptIncome)}
            </td>
            <td className="px-3 py-4 text-gray-700">
              {formatCurrency(totals.taxableIncome)}
            </td>
            <td className="px-3 py-4 text-red-700">
              {formatCurrency(totals.isr)}
            </td>
            <td className="px-3 py-4 text-green-700">
              {formatCurrency(totals.subsidioEmpleo)}
            </td>
            <td className="px-3 py-4 text-red-700">
              {formatCurrency(totals.imssEmployee)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.enfMat)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.invVida)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.cesantia)}
            </td>
            <td className="px-3 py-4 text-green-800 bg-green-100 border-l-2 border-green-300">
              {formatCurrency(totals.netSalary)}
            </td>
            <td className="px-3 py-4 bg-orange-100 border-l-2 border-orange-200 text-orange-900">
              {formatCurrency(totals.imssEmployer)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.patCuotaFija)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.patEnfMat)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.patRiesgo)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.patInvVida)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.patGuarderias)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.patRetiro)}
            </td>
            <td className="px-2 py-4 text-xs text-gray-600">
              {formatCurrency(totals.patCesantia)}
            </td>
            <td className="px-3 py-4 bg-orange-100 text-orange-900">
              {formatCurrency(totals.infonavitEmployer)}
            </td>
            <td className="px-3 py-4 bg-orange-100 text-orange-900">
              {formatCurrency(totals.isn)}
            </td>
            <td className="px-3 py-4 bg-orange-200 text-orange-900">
              {formatCurrency(totals.totalEmployerCost)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
