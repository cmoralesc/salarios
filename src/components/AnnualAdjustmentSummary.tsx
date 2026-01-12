import React from 'react';
import { AnnualIsrData } from '../utils/nominas';
import { formatCurrency } from '../utils/format';

interface Props {
  data: AnnualIsrData;
}

export default function AnnualAdjustmentSummary({ data }: Props) {
  const isSaldoAFavor = data.isrAdjustment < 0;
  const absAdjustment = Math.abs(data.isrAdjustment);

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        Cálculo Anual de ISR (Ajuste)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Ingresos Gravables Anuales</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(data.totalTaxableIncome)}</p>
          </div>
          
          <div>
             <p className="text-sm text-gray-600 mb-1">ISR Anual Calculado (Tabla Anual)</p>
             <p className="text-xl font-bold text-gray-900">{formatCurrency(data.annualIsrBruto)}</p>
          </div>

          <div>
             <p className="text-sm text-gray-600 mb-1">(-) Subsidio al Empleo Acumulado</p>
             <p className="text-xl font-bold text-green-700">{formatCurrency(data.totalSubsidio)}</p>
          </div>

          <div className="bg-blue-50 p-3 rounded border border-blue-200">
             <p className="text-sm text-gray-600 mb-1">(=) ISR Anual Neto</p>
             <p className="text-xl font-bold text-blue-900">{formatCurrency(data.annualIsr)}</p>
             <p className="text-xs text-blue-700 mt-1">Después de aplicar el subsidio</p>
          </div>

          <div>
             <p className="text-sm text-gray-600 mb-1">ISR Retenido en Nómina (Suma)</p>
             <p className="text-xl font-bold text-gray-900">{formatCurrency(data.totalIsrRetained)}</p>
          </div>
        </div>

        <div className={`p-5 rounded-lg border-2 flex flex-col justify-center ${isSaldoAFavor ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
           <p className="text-sm font-bold uppercase tracking-wide mb-2">
             {isSaldoAFavor ? (
               <span className="text-green-800">Saldo a Favor del Empleado</span>
             ) : (
               <span className="text-red-800">ISR a Cargo (Ajuste a Retener)</span>
             )}
           </p>
           <p className={`text-3xl font-extrabold ${isSaldoAFavor ? 'text-green-700' : 'text-red-700'}`}>
             {formatCurrency(absAdjustment)}
           </p>
           <p className="text-sm mt-3 text-gray-600 leading-relaxed">
             {isSaldoAFavor 
               ? "El ISR retenido durante el año fue mayor al impuesto anual calculado. Esta diferencia debe devolverse al empleado."
               : "El ISR retenido durante el año fue menor al impuesto anual calculado. Esta diferencia debe retenerse al empleado en el ajuste anual."}
           </p>
        </div>
      </div>
    </div>
  );
}
