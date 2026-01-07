import {
  TABLA_ISR_QUINCENAL,
  TABLA_ISR_ANUAL,
  SUBSIDIO_MENSUAL_2025_TOPE,
  SUBSIDIO_MENSUAL_2025_CANTIDAD,
  TASA_ISN,
  getDiasVacaciones,
  DIAS_VACACIONES,
  UMA_DIARIA,
  SALARIO_MINIMO_GENERAL,
} from "./tax-tables";
import { calculateIMSS, ImssBreakdown } from "./imss";

export interface PayrollPeriod {
  periodNumber: number;
  label: string;
  isAguinaldo: boolean;
  isPrimaVacacional: boolean;
  grossSalary: number;
  exemptIncome: number;
  taxableIncome: number;
  isr: number;
  subsidioEmpleo: number;
  imssEmployee: number;
  netSalary: number;
  imssEmployer: number;
  infonavitEmployer: number;
  isn: number;
  totalEmployerCost: number;
  imssBreakdown: ImssBreakdown;
}

export interface AnnualIsrData {
  totalTaxableIncome: number;
  annualIsr: number;
  totalIsrRetained: number;
  isrAdjustment: number;
}

export interface AnnualProjection {
  periods: PayrollPeriod[];
  totalNet: number;
  totalEmployerCost: number;
  sdi: number;
  dailySalary: number;
  annualIsrData: AnnualIsrData;
}

const calculateISRAnual = (annualTaxableIncome: number): number => {
  if (annualTaxableIncome <= 0) return 0;

  const row = TABLA_ISR_ANUAL.find((r, index) => {
    const nextRow = TABLA_ISR_ANUAL[index + 1];
    return (
      annualTaxableIncome >= r.limiteInferior &&
      (!nextRow || annualTaxableIncome < nextRow.limiteInferior)
    );
  });

  if (!row) return 0;

  const excedente = annualTaxableIncome - row.limiteInferior;
  const impuestoMarginal = excedente * row.porcentaje;
  return impuestoMarginal + row.cuotaFija;
};

const calculateISR = (
  taxableIncome: number
): { isrDeterminado: number; subsidioAplicado: number } => {
  if (taxableIncome <= 0) return { isrDeterminado: 0, subsidioAplicado: 0 };

  // Buscar rango
  const row = TABLA_ISR_QUINCENAL.find((r, index) => {
    const nextRow = TABLA_ISR_QUINCENAL[index + 1];
    return (
      taxableIncome >= r.limiteInferior &&
      (!nextRow || taxableIncome < nextRow.limiteInferior)
    );
  });

  let isrDeterminado = 0;
  if (row) {
    const excedente = taxableIncome - row.limiteInferior;
    const impuestoMarginal = excedente * row.porcentaje;
    isrDeterminado = impuestoMarginal + row.cuotaFija;
  }

  // Subsidio al Empleo 2025
  // Regla: 13.8% de la UMA Mensual para ingresos mensuales <= $10,171.00
  // Para cálculo quincenal:
  // Tope Quincenal = Tope Mensual / 2
  // Subsidio Quincenal = Subsidio Mensual / 2

  const topeQuincenal = SUBSIDIO_MENSUAL_2025_TOPE / 2;
  const subsidioQuincenal = SUBSIDIO_MENSUAL_2025_CANTIDAD / 2;

  let subsidioAplicado = 0;

  if (taxableIncome <= topeQuincenal) {
    subsidioAplicado = subsidioQuincenal;
  }

  return { isrDeterminado, subsidioAplicado };
};

export const calculateSDI = (
  dailySalary: number,
  yearsOfService: number
): number => {
  const daysVacation = getDiasVacaciones(yearsOfService);
  const primaVacacionalRate = 0.25; // 25% por ley
  const daysAguinaldo = 15; // 15 días por ley

  // Factor de Integración = 1 + (Días Aguinaldo + (Días Vacaciones * % Prima)) / 365
  const factor = 1 + (daysAguinaldo + daysVacation * primaVacacionalRate) / 365;

  return dailySalary * factor;
};

export const calculatePayrollProjection = (
  dailySalary: number,
  startDate: Date,
  riskPremium?: number
): AnnualProjection => {
  const today = new Date();
  const entryYear = startDate.getFullYear();
  const entryMonth = startDate.getMonth();
  const entryDay = startDate.getDate();

  // Calcular antigüedad aproximada para el año actual de proyección
  // Asumimos proyección del año calendario actual (Ene-Dic)
  // O proyección a 12 meses futuros. Haremos año calendario estándar.
  const currentYear = today.getFullYear();
  const yearsOfService = Math.max(0, currentYear - entryYear); // Antigüedad base

  // SDI
  const sdi = calculateSDI(dailySalary, yearsOfService);

  const periods: PayrollPeriod[] = [];
  let annualNet = 0;
  let annualCost = 0;
  let totalTaxableIncome = 0;
  let totalIsrRetained = 0;
  let totalSubsidioCorrespondiente = 0;

  // Generar 24 Quincenas
  for (let i = 1; i <= 24; i++) {
    const isAguinaldoPeriod = i === 24; // 2da Quincena Diciembre

    // Determinar si es quincena de aniversario para prima vacacional
    // Quincena 1 = Ene 1-15, Q2 = Ene 16-31, etc.
    // Mes 0 (Ene) -> Q1, Q2. Mes 1 (Feb) -> Q3, Q4.
    // Q = Month * 2 + (Day > 15 ? 2 : 1)
    const anniversaryQuincena = entryMonth * 2 + (entryDay > 15 ? 2 : 1);
    const isPrimaPeriod = i === anniversaryQuincena;

    // Sueldo Base Quincenal
    // Usamos 15.2083 (365/24) para proyección anual precisa de costos y días cotizados
    const daysInPeriod = 365 / 24;
    const salaryQuincenal = dailySalary * daysInPeriod;

    // Percepciones Adicionales
    let additionalIncome = 0;

    if (isAguinaldoPeriod) {
      additionalIncome += dailySalary * 15; // 15 días aguinaldo
    }

    if (isPrimaPeriod) {
      const diasVac = getDiasVacaciones(yearsOfService);
      const prima = dailySalary * diasVac * 0.25;
      additionalIncome += prima;
    }

    const totalGross = salaryQuincenal + additionalIncome;
    const taxableIncome = totalGross; // Simplificación: Todo gravable (Aguinaldo tiene exención 30 UMAS, Prima 15 UMAS)

    // Ajuste Exenciones ISR (Para hacerlo más real)
    // Exención Aguinaldo: 30 UMAS
    // Exención Prima: 15 UMAS
    let exemptIncome = 0;

    if (isAguinaldoPeriod) {
      exemptIncome += Math.min(dailySalary * 15, UMA_DIARIA * 30);
    }
    if (isPrimaPeriod) {
      const diasVac = getDiasVacaciones(yearsOfService);
      const prima = dailySalary * diasVac * 0.25;
      exemptIncome += Math.min(prima, UMA_DIARIA * 15);
    }

    const { isrDeterminado, subsidioAplicado } = calculateISR(
      taxableIncome - exemptIncome
    );

    // Artículo 96 LISR: No se efectuará retención a las personas que en el mes únicamente perciban un salario mínimo general.
    const isMinimumWage = dailySalary <= SALARIO_MINIMO_GENERAL + 0.01;
    let finalIsr = isrDeterminado;
    let finalSubsidio = subsidioAplicado;

    if (isMinimumWage) {
      finalIsr = 0;
      finalSubsidio = 0;
    }

    // Acumulados para ajuste anual
    const periodTaxableIncome = taxableIncome - exemptIncome;
    const periodIsrRetained = Math.max(0, finalIsr - finalSubsidio);

    totalTaxableIncome += periodTaxableIncome;
    totalIsrRetained += periodIsrRetained;
    totalSubsidioCorrespondiente += finalSubsidio;

    // IMSS
    const imssCalc = calculateIMSS(sdi, daysInPeriod, riskPremium, dailySalary);
    const imssEmp = imssCalc.employee.total;
    const imssPat = imssCalc.employer.total;

    // ISN (4% sobre Remuneraciones)
    const isn = totalGross * TASA_ISN;

    // Ajuste Subsidio 2024/2025: El subsidio solo acredita el ISR, no se entrega efectivo.
    // Si subsidio > ISR, el ISR retenido es 0, y el neto es (Bruto - IMSS).
    const netSalary = totalGross - periodIsrRetained - imssEmp;

    const employerCost = totalGross + imssPat + isn; // Infonavit ya incluido en imssCalc.employer.total (revisar)

    periods.push({
      periodNumber: i,
      label: `Q${i}`,
      isAguinaldo: isAguinaldoPeriod,
      isPrimaVacacional: isPrimaPeriod,
      grossSalary: totalGross,
      exemptIncome: exemptIncome,
      taxableIncome: taxableIncome - exemptIncome,
      isr: isrDeterminado, // Mostrar el ISR calculado
      subsidioEmpleo: subsidioAplicado, // Mostrar el subsidio aplicado
      imssEmployee: imssEmp,
      netSalary: netSalary,
      imssEmployer: imssPat,
      infonavitEmployer: imssCalc.employer.infonavit, // Desglosar visualmente si se quiere
      isn: isn,
      totalEmployerCost: employerCost,
      imssBreakdown: imssCalc,
    });

    annualNet += netSalary;
    annualCost += employerCost;
  }

  // Cálculo Anual
  // El ISR Anual Neto debe considerar el subsidio acumulado
  let annualIsrBruto = calculateISRAnual(totalTaxableIncome);
  let annualIsrNeto = Math.max(
    0,
    annualIsrBruto - totalSubsidioCorrespondiente
  );

  // Regla Salario Mínimo Anual:
  // Aunque el cálculo anual aritméticamente arroje impuesto, el Artículo 96 LISR exenta la retención mensual,
  // y el Artículo 97 LFT prohíbe descuentos al salario mínimo.
  // Por tanto, no se debe generar un impuesto a cargo (ajuste) que reduzca el salario mínimo.
  const isMinimumWageWorker = dailySalary <= SALARIO_MINIMO_GENERAL + 0.01;
  if (isMinimumWageWorker) {
    annualIsrNeto = 0;
  }

  // El ajuste es lo que falta por pagar (o a favor)
  // Adjustment = (TaxDue - Subsidy) - TaxRetained
  const isrAdjustment = annualIsrNeto - totalIsrRetained;

  return {
    periods,
    totalNet: annualNet,
    totalEmployerCost: annualCost,
    sdi,
    dailySalary,
    annualIsrData: {
      totalTaxableIncome,
      annualIsr: annualIsrNeto, // Return the Net Annual ISR
      totalIsrRetained,
      isrAdjustment,
    },
  };
};
