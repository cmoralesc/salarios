import { UMA_DIARIA, SALARIO_MINIMO_GENERAL } from "./tax-tables";

export interface ImssBreakdown {
  employer: {
    cuotaFija: number;
    excedente: number;
    prestacionesDinero: number;
    gastosMedicos: number;
    riesgoTrabajo: number;
    invalidezVida: number;
    guarderias: number;
    retiro: number;
    cesantia: number;
    infonavit: number;
    total: number;
  };
  employee: {
    excedente: number;
    prestacionesDinero: number;
    gastosMedicos: number;
    invalidezVida: number;
    cesantia: number;
    total: number;
  };
}

// Porcentajes Obrero (Estándar)
const P_OBRERO_EXCEDENTE = 0.004;
const P_OBRERO_PREST_DINERO = 0.0025;
const P_OBRERO_GASTOS_MED = 0.00375;
const P_OBRERO_INVALIDEZ = 0.00625;
const P_OBRERO_CESANTIA = 0.01125;

// Porcentajes Patrón (Base 2024-2025)
const P_PATRON_CUOTA_FIJA_UMA = 0.204; // Sobre UMA mensual
const P_PATRON_EXCEDENTE = 0.011;
const P_PATRON_PREST_DINERO = 0.007;
const P_PATRON_GASTOS_MED = 0.0105;
const P_PATRON_INVALIDEZ = 0.0175;
const P_PATRON_GUARDERIAS = 0.01;
const P_PATRON_RETIRO = 0.02;
const P_PATRON_INFONAVIT = 0.05;
// Riesgo de trabajo varía por empresa (Clase I mínima)
export const RISK_CLASSES = [
  { label: "Clase I (0.54355%)", value: 0.0054355 },
  { label: "Clase II (1.13065%)", value: 0.0113065 },
  { label: "Clase III (2.59840%)", value: 0.025984 },
  { label: "Clase IV (4.65325%)", value: 0.0465325 },
  { label: "Clase V (7.58875%)", value: 0.0758875 },
];

// Tabla Cesantía Patronal 2025 (Reforma Pensiones - Artículo Segundo Transitorio)
const getTasaCesantiaPatronal = (sbc: number): number => {
  // 1.0 SM
  if (sbc <= SALARIO_MINIMO_GENERAL) return 0.0315;

  const vecesUMA = sbc / UMA_DIARIA;

  // Rangos 2025
  if (vecesUMA <= 1.5) return 0.03544;
  if (vecesUMA <= 2.0) return 0.04426;
  if (vecesUMA <= 2.5) return 0.04954;
  if (vecesUMA <= 3.0) return 0.05307;
  if (vecesUMA <= 3.5) return 0.05559;
  if (vecesUMA <= 4.0) return 0.05747;

  // 4.01 UMA en adelante
  return 0.06422;
};

export const calculateIMSS = (
  sbc: number,
  dias: number = 15,
  riskPremium: number = RISK_CLASSES[0].value,
  dailySalary?: number // Nuevo parámetro opcional
): ImssBreakdown => {
  // Bases de Cotización
  const umaDiaria = UMA_DIARIA;
  const sbcTope = umaDiaria * 25; // Tope 25 UMAs
  const baseCotizacion = Math.min(sbc, sbcTope);
  const baseExcedente = Math.max(baseCotizacion - umaDiaria * 3, 0);

  // Verificación Salario Mínimo (Artículo 36 LSS)
  // Si el trabajador gana el salario mínimo como cuota diaria, el patrón paga la cuota obrera.
  // Nota: Usamos un pequeño margen de tolerancia por redondeo si es necesario, pero la ley es estricta con la cuota diaria.
  const isMinimumWage =
    dailySalary !== undefined && dailySalary <= SALARIO_MINIMO_GENERAL + 0.01;

  // Cálculo Obrero
  let empExcedente = baseExcedente * P_OBRERO_EXCEDENTE * dias;
  let empPrestDinero = baseCotizacion * P_OBRERO_PREST_DINERO * dias;
  let empGastosMed = baseCotizacion * P_OBRERO_GASTOS_MED * dias;
  let empInvalidez = baseCotizacion * P_OBRERO_INVALIDEZ * dias;
  let empCesantia = baseCotizacion * P_OBRERO_CESANTIA * dias;

  if (isMinimumWage) {
    empExcedente = 0;
    empPrestDinero = 0;
    empGastosMed = 0;
    empInvalidez = 0;
    empCesantia = 0;
  }

  const totalEmployee =
    empExcedente + empPrestDinero + empGastosMed + empInvalidez + empCesantia;

  // Cálculo Patrón
  const patCuotaFija = umaDiaria * P_PATRON_CUOTA_FIJA_UMA * dias; // Se paga por días laborados
  const patExcedente = baseExcedente * P_PATRON_EXCEDENTE * dias;
  const patPrestDinero = baseCotizacion * P_PATRON_PREST_DINERO * dias;
  const patGastosMed = baseCotizacion * P_PATRON_GASTOS_MED * dias;
  const patRiesgo = baseCotizacion * riskPremium * dias; // Usando prima variable
  const patInvalidez = baseCotizacion * P_PATRON_INVALIDEZ * dias;
  const patGuarderias = baseCotizacion * P_PATRON_GUARDERIAS * dias;
  const patRetiro = baseCotizacion * P_PATRON_RETIRO * dias;

  const tasaCesantia = getTasaCesantiaPatronal(baseCotizacion);
  const patCesantia = baseCotizacion * tasaCesantia * dias;

  const patInfonavit = baseCotizacion * P_PATRON_INFONAVIT * dias;

  // Si es salario mínimo, sumar la cuota obrera al costo patronal (excepto Infonavit y Retiro que ya son patronales)
  // Pero ojo: La ley dice "Corresponde al patrón pagar íntegramente la cuota señalada para los trabajadores"
  // Esto significa que el costo para el patrón AUMENTA en la cantidad que le correspondía al obrero.

  let extraEmployerCost = 0;
  if (isMinimumWage) {
    // Recalcular lo que hubiera pagado el obrero para sumarlo al patrón
    const originalEmpExcedente = baseExcedente * P_OBRERO_EXCEDENTE * dias;
    const originalEmpPrestDinero =
      baseCotizacion * P_OBRERO_PREST_DINERO * dias;
    const originalEmpGastosMed = baseCotizacion * P_OBRERO_GASTOS_MED * dias;
    const originalEmpInvalidez = baseCotizacion * P_OBRERO_INVALIDEZ * dias;
    const originalEmpCesantia = baseCotizacion * P_OBRERO_CESANTIA * dias;

    extraEmployerCost =
      originalEmpExcedente +
      originalEmpPrestDinero +
      originalEmpGastosMed +
      originalEmpInvalidez +
      originalEmpCesantia;
  }

  const totalEmployer =
    patCuotaFija +
    patExcedente +
    patPrestDinero +
    patGastosMed +
    patRiesgo +
    patInvalidez +
    patGuarderias +
    patRetiro +
    patCesantia +
    patInfonavit +
    extraEmployerCost; // Se suma el costo absorbido

  return {
    employer: {
      cuotaFija: patCuotaFija,
      excedente: patExcedente,
      prestacionesDinero: patPrestDinero,
      gastosMedicos: patGastosMed,
      riesgoTrabajo: patRiesgo,
      invalidezVida: patInvalidez,
      guarderias: patGuarderias,
      retiro: patRetiro,
      cesantia: patCesantia,
      infonavit: patInfonavit,
      total: totalEmployer,
    },
    employee: {
      excedente: empExcedente,
      prestacionesDinero: empPrestDinero,
      gastosMedicos: empGastosMed,
      invalidezVida: empInvalidez,
      cesantia: empCesantia,
      total: totalEmployee,
    },
  };
};
