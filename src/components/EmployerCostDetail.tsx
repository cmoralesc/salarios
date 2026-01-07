import { ImssBreakdown } from "../utils/imss";
import { formatCurrency } from "../utils/format";

interface EmployerCostDetailProps {
  breakdown: ImssBreakdown["employer"];
  totalIsn: number;
  periodLabel: string; // "Anual" or "Quincenal"
}

export default function EmployerCostDetail({
  breakdown,
  totalIsn,
  periodLabel,
}: EmployerCostDetailProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Desglose de Costo Patronal ({periodLabel})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-orange-700 mb-2 border-b pb-1">
            Seguridad Social (IMSS)
          </h4>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Cuota Fija (Enf. y Mat.)</span>
              <span className="font-medium">
                {formatCurrency(breakdown.cuotaFija)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Excedente 3 UMA</span>
              <span className="font-medium">
                {formatCurrency(breakdown.excedente)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Prestaciones en Dinero</span>
              <span className="font-medium">
                {formatCurrency(breakdown.prestacionesDinero)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Gastos Médicos Pensionados</span>
              <span className="font-medium">
                {formatCurrency(breakdown.gastosMedicos)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Riesgo de Trabajo</span>
              <span className="font-medium">
                {formatCurrency(breakdown.riesgoTrabajo)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Invalidez y Vida</span>
              <span className="font-medium">
                {formatCurrency(breakdown.invalidezVida)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Guarderías y Prest. Soc.</span>
              <span className="font-medium">
                {formatCurrency(breakdown.guarderias)}
              </span>
            </li>
            <li className="flex justify-between border-t pt-1 mt-1 font-semibold text-gray-900">
              <span>Subtotal IMSS</span>
              <span>
                {formatCurrency(
                  breakdown.total -
                    breakdown.retiro -
                    breakdown.cesantia -
                    breakdown.infonavit
                )}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-orange-700 mb-2 border-b pb-1">
            Retiro y Vivienda
          </h4>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Retiro (SAR 2%)</span>
              <span className="font-medium">
                {formatCurrency(breakdown.retiro)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Cesantía y Vejez</span>
              <span className="font-medium">
                {formatCurrency(breakdown.cesantia)}
              </span>
            </li>
            <li className="flex justify-between">
              <span>Infonavit (5%)</span>
              <span className="font-medium">
                {formatCurrency(breakdown.infonavit)}
              </span>
            </li>
            <li className="flex justify-between border-t pt-1 mt-1 font-semibold text-gray-900">
              <span>Subtotal RCV + Infonavit</span>
              <span>
                {formatCurrency(
                  breakdown.retiro + breakdown.cesantia + breakdown.infonavit
                )}
              </span>
            </li>
          </ul>

          <h4 className="font-medium text-orange-700 mt-4 mb-2 border-b pb-1">
            Impuestos Locales
          </h4>
          <ul className="space-y-2 text-sm text-gray-800">
            <li className="flex justify-between">
              <span>Impuesto s/ Nómina (3%)</span>
              <span className="font-medium">{formatCurrency(totalIsn)}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center bg-orange-50 p-4 rounded">
        <span className="text-lg font-bold text-gray-800">
          Costo Patronal Total
        </span>
        <span className="text-xl font-bold text-orange-800">
          {formatCurrency(breakdown.total + totalIsn)}
        </span>
      </div>
    </div>
  );
}
