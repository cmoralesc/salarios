import {
  getYearlyConfig,
  getDiasVacaciones,
  YearlyConfig,
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
  aguinaldoProvision: number;
  primaVacacionalProvision: number;
  isnProvision: number;
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
  seniority: number;
  vacationDays: number;
  integrationFactor: number;
  annualIsrData: AnnualIsrData;
}

const calculateISRAnual = (annualTaxableIncome: number, config: YearlyConfig): number => {
  if (annualTaxableIncome <= 0) return 0;

  const tabla = config.tablaIsrAnual;
  const row = tabla.find((r, index) => {
    const nextRow = tabla[index + 1];
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
  taxableIncome: number,
  config: YearlyConfig,
  isEnero: boolean = false
): { isrDeterminado: number; subsidioAplicado: number } => {
  if (taxableIncome <= 0) return { isrDeterminado: 0, subsidioAplicado: 0 };

  // Proyectar a mensual para usar tablas mensuales (Regla 30.4 días)
  const incomeMensual = taxableIncome * 2;

  // Buscar rango en tabla mensual
  const tabla = config.tablaIsrMensual;
  const row = tabla.find((r, index) => {
    const nextRow = tabla[index + 1];
    return (
      incomeMensual >= r.limiteInferior &&
      (!nextRow || incomeMensual < nextRow.limiteInferior)
    );
  });

  let isrDeterminadoMensual = 0;
  if (row) {
    const excedente = incomeMensual - row.limiteInferior;
    const impuestoMarginal = excedente * row.porcentaje;
    isrDeterminadoMensual = impuestoMarginal + row.cuotaFija;
  }

  // Subsidio al Empleo (Regla Mensual)
  const topeMensual = config.subsidioMensualTope;
  let subsidioMensual = config.subsidioMensualCantidad;

  // Ajuste para 2026 (Subsidio variable Enero vs Feb-Dic)
  if (isEnero && config.subsidioMensualCantidadEnero) {
    subsidioMensual = config.subsidioMensualCantidadEnero;
  } else if (!isEnero && config.subsidioMensualCantidadFebDic) {
    subsidioMensual = config.subsidioMensualCantidadFebDic;
  }

  let subsidioAplicadoMensual = 0;

  if (incomeMensual <= topeMensual) {
    subsidioAplicadoMensual = subsidioMensual;
  }

  // Retornar la mitad para el periodo quincenal
  return {
    isrDeterminado: isrDeterminadoMensual / 2,
    subsidioAplicado: subsidioAplicadoMensual / 2
  };
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
  riskPremium?: number,
  year: number = 2025
): AnnualProjection => {
  const config = getYearlyConfig(year);
  const umaDiaria = config.umaDiaria;
  const sm = config.salarioMinimoGeneral;
  const tasaIsn = config.tasaIsn;

  const entryYear = startDate.getFullYear();
  const entryMonth = startDate.getMonth();
  const entryDay = startDate.getDate();

  // Calcular antigüedad aproximada para el año actual de proyección
  // Asumimos proyección del año calendario actual (Ene-Dic)
  // O proyección a 12 meses futuros. Haremos año calendario estándar.
  // Calcular antigüedad para el año de proyección (año de empleo que está cursando)
  const yearsOfService = Math.max(1, year - entryYear + 1);

  // SDI (Se calculará por periodo para mayor precisión si hay aniversario)
  let sdi = 0;
  let vacationDays = 0; // Will be set in the first period
  let integrationFactor = 0; // Will be set in the first period

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
    // Determinar si es Enero para el subsidio y UMA 2026
    const isEnero = i <= 2;
    const currentUma = (isEnero && config.umaDiariaEnero) ? config.umaDiariaEnero : umaDiaria;

    // Sueldo Base Quincenal
    // Usamos 15.2 (30.4 / 2) como base para el periodo trabajado
    const daysInPeriod = 15.2;
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
      exemptIncome += Math.min(dailySalary * 15, currentUma * 30);
    }
    if (isPrimaPeriod) {
      const diasVac = getDiasVacaciones(yearsOfService);
      const prima = dailySalary * diasVac * 0.25;
      exemptIncome += Math.min(prima, currentUma * 15);
    }



    const { isrDeterminado, subsidioAplicado } = calculateISR(
      taxableIncome - exemptIncome,
      config,
      isEnero
    );

    // Artículo 96 LISR: No se efectuará retención a las personas que en el mes únicamente perciban un salario mínimo general.
    const isMinimumWage = dailySalary <= sm + 0.01;
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

    // Determinar antigüedad para esta quincena específica
    // (Aproximación mensual: si el mes actual es >= mes de ingreso, ya cumplió año)
    const currentPeriodMonth = Math.floor((i - 1) / 2);
    let effectiveYearsOfService = year - entryYear;
    if (currentPeriodMonth >= entryMonth) {
      effectiveYearsOfService += 1;
    }
    effectiveYearsOfService = Math.max(1, effectiveYearsOfService);

    // SDI específico para este periodo
    const periodVacationDays = getDiasVacaciones(effectiveYearsOfService);
    const periodIntegrationFactor = 1 + (15 + periodVacationDays * 0.25) / 365;
    const periodSdi = dailySalary * periodIntegrationFactor;

    // Actualizar el SDI y factores de la respuesta (usamos el del primer periodo como referencia principal)
    if (i === 1) {
      sdi = periodSdi;
      vacationDays = periodVacationDays;
      integrationFactor = periodIntegrationFactor;
    }

    // IMSS
    const imssCalc = calculateIMSS(periodSdi, daysInPeriod, riskPremium, dailySalary, year, currentUma);
    const imssEmp = imssCalc.employee.total;
    const imssPat = imssCalc.employer.total;

    // ISN (4% sobre Remuneraciones)
    const isn = totalGross * tasaIsn;

    // Provisión Mensual de Prestaciones (Aguinaldo y Prima Vacacional)
    // Se divide el monto anual entre 24 para obtener la provisión por quincena
    const aguinaldoAnual = dailySalary * 15;
    const diasVacAnuales = getDiasVacaciones(effectiveYearsOfService);
    const primaVacacionalAnual = dailySalary * diasVacAnuales * 0.25;

    const aguinaldoProvision = aguinaldoAnual / 24;
    const primaVacacionalProvision = primaVacacionalAnual / 24;
    const isnProvision = (aguinaldoProvision + primaVacacionalProvision) * tasaIsn;

    // Ajuste Subsidio 2024/2025: El subsidio solo acredita el ISR, no se entrega efectivo.
    // Si subsidio > ISR, el ISR retenido es 0, y el neto es (Bruto - IMSS).
    const netSalary = totalGross - periodIsrRetained - imssEmp;

    const employerCost = totalGross + imssPat + isn + aguinaldoProvision + primaVacacionalProvision + isnProvision;

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
      aguinaldoProvision: aguinaldoProvision,
      primaVacacionalProvision: primaVacacionalProvision,
      isnProvision: isnProvision,
      totalEmployerCost: employerCost,
      imssBreakdown: imssCalc,
    });

    annualNet += netSalary;
    annualCost += employerCost;
  }

  // Cálculo Anual
  // El ISR Anual Neto debe considerar el subsidio acumulado
  const annualIsrBruto = calculateISRAnual(totalTaxableIncome, config);
  let annualIsrNeto = Math.max(
    0,
    annualIsrBruto - totalSubsidioCorrespondiente
  );

  // Regla Salario Mínimo Anual:
  // Aunque el cálculo anual aritméticamente arroje impuesto, el Artículo 96 LISR exenta la retención mensual,
  // y el Artículo 97 LFT prohíbe descuentos al salario mínimo.
  // Por tanto, no se debe generar un impuesto a cargo (ajuste) que reduzca el salario mínimo.
  const isMinimumWageWorker = dailySalary <= sm + 0.01;
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
    seniority: yearsOfService,
    vacationDays,
    integrationFactor,
    annualIsrData: {
      totalTaxableIncome,
      annualIsr: annualIsrNeto, // Return the Net Annual ISR
      totalIsrRetained,
      isrAdjustment,
    },
  };
};
