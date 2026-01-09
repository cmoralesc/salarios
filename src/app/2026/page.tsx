"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { calculatePayrollProjection } from "../../utils/nominas";
import { RISK_CLASSES } from "../../utils/imss";
import PayrollTable from "../../components/PayrollTable";
import AnnualAdjustmentSummary from "../../components/AnnualAdjustmentSummary";
import EmployerCostDetail from "../../components/EmployerCostDetail";
import TaxTablesView from "../../components/TaxTablesView";
import ImssCalculationExplanation from "../../components/ImssCalculationExplanation";
import MonthlyNetTable from "../../components/MonthlyNetTable";

export default function Home2026() {
  const [dailySalary, setDailySalary] = useState<number>(315.04);
  const [startDate, setStartDate] = useState<string>("2024-01-01");
  const [riskPremium, setRiskPremium] = useState<number>(0.0054355);

  const projection = useMemo(() => {
    return calculatePayrollProjection(
      dailySalary,
      new Date(startDate),
      riskPremium,
      2026
    );
  }, [dailySalary, startDate, riskPremium]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Year Selector */}
        <div className="flex justify-center space-x-4 mb-4">
          <Link
            href="/"
            className="bg-white text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-full font-medium border border-gray-200 shadow-sm transition-colors"
          >
            ← Volver a 2025
          </Link>
          <span className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-sm">
            2026
          </span>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Calculadora de Salarios México 2026
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Proyección anual, IMSS, ISR y Subsidio al Empleo (Proyectado).
          </p>
          {/* Reference Values */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="bg-emerald-600 p-4 rounded-xl shadow-md text-white">
              <h3 className="text-xs font-semibold opacity-80 uppercase tracking-wider">Salario Mínimo 2026</h3>
              <p className="text-2xl font-bold mt-1">$315.04</p>
            </div>
            <div className="bg-teal-600 p-4 rounded-xl shadow-md text-white">
              <h3 className="text-xs font-semibold opacity-80 uppercase tracking-wider">UMA 2026</h3>
              <p className="text-2xl font-bold mt-1">$117.31</p>
              <p className="text-[10px] opacity-70 mt-1 font-medium italic">En Enero se aplica UMA 2025 ($113.14)</p>
            </div>
            <div className="bg-indigo-600 p-4 rounded-xl shadow-md text-white">
              <div className="flex flex-col">
                <h3 className="text-xs font-semibold opacity-80 uppercase tracking-wider">SDI</h3>
                <p className="text-2xl font-bold mt-1">
                  {projection.sdi.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] opacity-70 font-medium">
                  <span>Factor: {projection.integrationFactor.toFixed(4)}</span>
                  <span>•</span>
                  <span>{projection.vacationDays} días vac.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert for 2026 */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded shadow-sm">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <span className="font-bold">Nota 2026:</span> Esta proyección utiliza el Salario Mínimo General y el valor oficial de la UMA publicados por el <span className="font-bold">INEGI</span>.
              </p>
            </div>
          </div>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900 font-medium"
                min={315.04}
              />
              <p className="mt-1 text-xs text-gray-500">
                Mensual Bruto Aprox: {(dailySalary * 30.4).toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
              {dailySalary < 315.04 && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  El salario es menor al mínimo 2026 ($315.04)
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Ingreso
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prima de Riesgo
              </label>
              <select
                value={riskPremium}
                onChange={(e) => setRiskPremium(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900 font-medium"
              >
                {RISK_CLASSES.map((cls) => (
                  <option key={cls.value} value={cls.value}>
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-12">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-600 p-6 rounded-lg shadow-lg text-white">
              <h3 className="text-lg font-semibold opacity-90">Neto Anual Estimado 2026</h3>
              <p className="text-4xl font-bold mt-2">
                {projection.totalNet.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
              <p className="text-sm mt-2 opacity-80">
                Suma de 24 quincenas + Aguinaldo + Prima Vacacional.
              </p>
            </div>
            <div className="bg-orange-600 p-6 rounded-lg shadow-lg text-white">
              <h3 className="text-lg font-semibold opacity-90">Costo Total Patronal 2026</h3>
              <p className="text-4xl font-bold mt-2">
                {projection.totalEmployerCost.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
              </p>
              <p className="text-sm mt-2 opacity-80">
                Incluye Salario, IMSS, Infonavit e ISN.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ajuste Anual de ISR (2026)</h2>
            <AnnualAdjustmentSummary data={projection.annualIsrData} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Neto Mensual del Empleado</h2>
            <MonthlyNetTable periods={projection.periods} />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Desglose de Nómina Quincenal</h2>
            <PayrollTable periods={projection.periods} />
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Detalle de Costo Patronal</h2>
              <EmployerCostDetail periods={projection.periods} />
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Metodología IMSS 2026</h2>
              <ImssCalculationExplanation year={2026} />
            </section>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tablas de Impuestos (Referencia 2026)</h2>
            <TaxTablesView year={2026} />
          </section>
        </div>
      </div>
    </div>
  );
}
