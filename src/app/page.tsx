"use client";

import { useState, useMemo } from "react";
import { calculatePayrollProjection } from "../utils/nominas";
import PayrollTable from "../components/PayrollTable";
import AnnualAdjustmentSummary from "../components/AnnualAdjustmentSummary";
import EmployerCostDetail from "../components/EmployerCostDetail";
import TaxTablesView from "../components/TaxTablesView";
import ImssCalculationExplanation from "../components/ImssCalculationExplanation";

export default function Home() {
  const [dailySalary, setDailySalary] = useState<number>(1000);
  const [startDate, setStartDate] = useState<string>("2024-01-01");
  const [riskPremium, setRiskPremium] = useState<number>(0.54355);

  const projection = useMemo(() => {
    return calculatePayrollProjection(
      dailySalary,
      new Date(startDate),
      riskPremium
    );
  }, [dailySalary, startDate, riskPremium]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Calculadora de Salarios México 2025
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Proyección anual, IMSS, ISR y Subsidio al Empleo.
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Salario Diario (MXN)
              </label>
              <input
                type="number"
                value={dailySalary}
                onChange={(e) => setDailySalary(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
              <p className="mt-1 text-xs text-gray-500">
                Mensual Bruto Aprox: {(dailySalary * 30.4).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Ingreso
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prima de Riesgo (%)
              </label>
              <input
                type="number"
                step="0.00001"
                value={riskPremium}
                onChange={(e) => setRiskPremium(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-12">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-600 p-6 rounded-lg shadow-lg text-white">
              <h3 className="text-lg font-semibold opacity-90">Neto Anual Estimado</h3>
              <p className="text-4xl font-bold mt-2">
                {projection.totalNet.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
              <p className="text-sm mt-2 opacity-80">
                Suma de 24 quincenas + Aguinaldo + Prima Vacacional.
              </p>
            </div>
            <div className="bg-orange-600 p-6 rounded-lg shadow-lg text-white">
              <h3 className="text-lg font-semibold opacity-90">Costo Total Patronal Anual</h3>
              <p className="text-4xl font-bold mt-2">
                {projection.totalEmployerCost.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
              <p className="text-sm mt-2 opacity-80">
                Incluye Salario, IMSS, Infonavit e ISN.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ajuste Anual de ISR</h2>
            <AnnualAdjustmentSummary data={projection.annualIsrData} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Desglose de Nómina Quincenal</h2>
            <PayrollTable periods={projection.periods} />
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalle de Costo Patronal</h2>
              <EmployerCostDetail
                breakdown={projection.periods[0].imssBreakdown.employer}
                totalIsn={projection.periods[0].isn}
                periodLabel="Quincenal (Promedio)"
              />
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Metodología IMSS 2025</h2>
              <ImssCalculationExplanation />
            </section>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tablas de Impuestos (Referencia)</h2>
            <TaxTablesView />
          </section>
        </div>
      </div>
    </div>
  );
}
