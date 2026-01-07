import { PayrollPeriod } from "../utils/nominas";

interface Props {
  periods: PayrollPeriod[];
}

interface MonthData {
  month: string;
  periodCount: number;
  totalNet: number;
  periods: number[];
}

export default function MonthlyNetTable({ periods }: Props) {
  // Agrupar quincenas por mes
  const monthlyData: MonthData[] = [];

  for (let month = 0; month < 12; month++) {
    const period1 = month * 2;
    const period2 = month * 2 + 1;

    const monthPeriods = periods.filter(
      (p) => p.periodNumber === period1 + 1 || p.periodNumber === period2 + 1
    );

    const totalNet = monthPeriods.reduce((sum, p) => sum + p.netSalary, 0);

    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    monthlyData.push({
      month: monthNames[month],
      periodCount: monthPeriods.length,
      totalNet,
      periods: monthPeriods.map(p => p.periodNumber)
    });
  }

  const annualTotal = monthlyData.reduce((sum, m) => sum + m.totalNet, 0);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Mes
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                Quincenas
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
              >
                Neto Mensual
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyData.map((month, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-indigo-50 transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {month.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Q{month.periods.join(", Q")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {month.totalNet.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gradient-to-r from-green-600 to-green-700">
            <tr>
              <td
                colSpan={2}
                className="px-6 py-4 text-sm font-bold text-white uppercase"
              >
                Total Anual
              </td>
              <td className="px-6 py-4 text-sm font-bold text-right text-white">
                {annualTotal.toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
