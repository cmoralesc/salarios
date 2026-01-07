import { PayrollPeriod } from "../utils/nominas";
import { formatCurrency } from "../utils/format";

interface EmployerCostDetailProps {
  periods: PayrollPeriod[];
}

export default function EmployerCostDetail({ periods }: EmployerCostDetailProps) {
  // Calcular totales mensuales (suma de 2 primeras quincenas como representación)
  const monthlyBreakdown = {
    cuotaFija: periods[0].imssBreakdown.employer.cuotaFija + periods[1].imssBreakdown.employer.cuotaFija,
    excedente: periods[0].imssBreakdown.employer.excedente + periods[1].imssBreakdown.employer.excedente,
    prestacionesDinero: periods[0].imssBreakdown.employer.prestacionesDinero + periods[1].imssBreakdown.employer.prestacionesDinero,
    gastosMedicos: periods[0].imssBreakdown.employer.gastosMedicos + periods[1].imssBreakdown.employer.gastosMedicos,
    riesgoTrabajo: periods[0].imssBreakdown.employer.riesgoTrabajo + periods[1].imssBreakdown.employer.riesgoTrabajo,
    invalidezVida: periods[0].imssBreakdown.employer.invalidezVida + periods[1].imssBreakdown.employer.invalidezVida,
    guarderias: periods[0].imssBreakdown.employer.guarderias + periods[1].imssBreakdown.employer.guarderias,
    retiro: periods[0].imssBreakdown.employer.retiro + periods[1].imssBreakdown.employer.retiro,
    cesantia: periods[0].imssBreakdown.employer.cesantia + periods[1].imssBreakdown.employer.cesantia,
    infonavit: periods[0].imssBreakdown.employer.infonavit + periods[1].imssBreakdown.employer.infonavit,
    total: periods[0].imssBreakdown.employer.total + periods[1].imssBreakdown.employer.total,
  };

  const monthlyIsn = periods[0].isn + periods[1].isn;
  const monthlyGrossSalary = periods[0].grossSalary + periods[1].grossSalary;
  const monthlyEmployerCost = periods[0].totalEmployerCost + periods[1].totalEmployerCost;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Desglose de Costo Patronal Mensual
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Suma de las primeras 2 quincenas (Enero - Q1 + Q2)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-orange-700 mb-2 border-b pb-1">
            Seguridad Social (IMSS)
          </h4>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Cuota Fija (Enf. y Mat.)</span>
              <span className="font-medium">
                {formatCurrency(monthlyBreakdown.cuotaFija)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Excedente 3 UMA</span>
              <span className="font-medium">
                {formatCurrency(monthlyBreakdown.excedente)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Prestaciones en Dinero</span>
              <span className="font-medium">
                {formatCurrency(monthlyBreakdown.prestacionesDinero)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Gastos Médicos Pensionados</span>
              <span className="font-medium">
                {formatCurrency(monthlyBreakdown.gastosMedicos)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Riesgo de Trabajo</span>
              <span className="font-medium">
                {formatCurrency(monthlyBreakdown.riesgoTrabajo)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Invalidez y Vida</span>
              <span className="font-medium">
                {formatCurrency(monthlyBreakdown.invalidezVida)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Guarderías y Prest. Soc.</span>
              <span className="font-medium">
                {formatCurrency(monthlyBreakdown.guarderias)}
              </span>
            </li>
            <li className="flex justify-between border-t pt-1 mt-1 font-semibold text-gray-900">
              <span>Subtotal IMSS</span>
              <span>
                {formatCurrency(
                  monthlyBreakdown.total -
                    monthlyBreakdown.retiro -
                    monthlyBreakdown.cesantia -
                    monthlyBreakdown.infonavit
                )}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-orange-700 mb-2 border-b pb-1">
            Retiro, Cesantía y Vejez
          </h4>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Retiro (2.0%)</span>
              <span className="font-medium">
                {formatCurrency(monthlyBreakdown.retiro)}
              </span>
            </li>
            <li className="flex flex-col">
              <div className="flex justify-between">
                <span>Cesantía y Vejez ({ (periods[0].imssBreakdown.employer.cesantiaRate * 100).toFixed(2) }%)</span>
                <span className="font-medium">
                  {formatCurrency(monthlyBreakdown.cesantia)}
                </span>
              </div>
            </li>
            <li className="flex justify-between border-t pt-1 mt-1 font-semibold text-gray-900">
              <span>Subtotal RCV</span>
              <span>
                {formatCurrency(
                  monthlyBreakdown.retiro + monthlyBreakdown.cesantia
                )}
              </span>
            </li>
          </ul>

          <h4 className="font-medium text-orange-700 mt-4 mb-2 border-b pb-1">
            Vivienda
          </h4>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Infonavit (5%)</span>
              <span className="font-medium">
                {formatCurrency(monthlyBreakdown.infonavit)}
              </span>
            </li>
          </ul>

          <h4 className="font-medium text-orange-700 mt-4 mb-2 border-b pb-1">
            Impuestos Locales
          </h4>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Impuesto s/ Nómina (4%)</span>
              <span className="font-medium">{formatCurrency(monthlyIsn)}</span>
            </li>
          </ul>

          <h4 className="font-medium text-orange-700 mt-4 mb-2 border-b pb-1">
            Salario Bruto
          </h4>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Salario Bruto Mensual</span>
              <span className="font-medium">{formatCurrency(monthlyGrossSalary)}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center bg-orange-50 p-4 rounded">
        <span className="text-lg font-bold text-gray-800">
          Costo Patronal Total Mensual
        </span>
        <span className="text-xl font-bold text-orange-800">
          {formatCurrency(monthlyEmployerCost)}
        </span>
      </div>
    </div>
  );
}
