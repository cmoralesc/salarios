import { getYearlyConfig, YearlyConfig } from "./tax-tables";

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
    cesantiaRate: number;
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

/**
 * Tabla Cesantía Patronal (Reforma Pensiones - Artículo Segundo Transitorio)
 * Las tasas aumentan gradualmente cada año hasta 2030.
 */
const getTasaCesantiaPatronal = (sbc: number, year: number, config: YearlyConfig, umaOverride?: number): number => {
  const sm = config.salarioMinimoGeneral;
  const uma = umaOverride || config.umaDiaria;

  // 1.0 SM
  if (sbc <= sm) return 0.0315;

  const vecesUMA = sbc / uma;

  if (year === 2026) {
    if (vecesUMA <= 1.5) return 0.03843; // Incremento 2026
    if (vecesUMA <= 2.0) return 0.05193;
    if (vecesUMA <= 2.5) return 0.06001;
    if (vecesUMA <= 3.0) return 0.06540;
    if (vecesUMA <= 3.5) return 0.06925;
    if (vecesUMA <= 4.0) return 0.07214;
    return 0.08241; // 4.01 UMA en adelante
  }

  // Rangos 2025
  if (vecesUMA <= 1.5) return 0.03544;
  if (vecesUMA <= 2.0) return 0.04426;
  if (vecesUMA <= 2.5) return 0.04954;
  if (vecesUMA <= 3.0) return 0.05307;
  if (vecesUMA <= 3.5) return 0.05559;
  if (vecesUMA <= 4.0) return 0.05747;
  return 0.06422; // 4.01 UMA en adelante
};

export const calculateIMSS = (
  sbc: number,
  dias: number = 15,
  riskPremium: number = RISK_CLASSES[0].value,
  dailySalary?: number,
  year: number = 2025,
  umaOverride?: number
): ImssBreakdown => {
  const config = getYearlyConfig(year);
  const umaDiaria = umaOverride || config.umaDiaria;
  const sm = config.salarioMinimoGeneral;

  // Bases de Cotización
  const sbcTope = umaDiaria * 25; // Tope 25 UMAs
  const baseCotizacion = Math.min(sbc, sbcTope);
  const baseExcedente = Math.max(baseCotizacion - umaDiaria * 3, 0);

  // Verificación Salario Mínimo (Artículo 36 LSS)
  const isMinimumWage = dailySalary !== undefined && dailySalary <= sm + 0.01;

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
  const patCuotaFija = umaDiaria * P_PATRON_CUOTA_FIJA_UMA * dias;
  const patExcedente = baseExcedente * P_PATRON_EXCEDENTE * dias;
  const patPrestDinero = baseCotizacion * P_PATRON_PREST_DINERO * dias;
  const patGastosMed = baseCotizacion * P_PATRON_GASTOS_MED * dias;
  const patRiesgo = baseCotizacion * riskPremium * dias;
  const patInvalidez = baseCotizacion * P_PATRON_INVALIDEZ * dias;
  const patGuarderias = baseCotizacion * P_PATRON_GUARDERIAS * dias;
  const patRetiro = baseCotizacion * P_PATRON_RETIRO * dias;

  const tasaCesantia = getTasaCesantiaPatronal(baseCotizacion, year, config, umaOverride);
  const patCesantia = baseCotizacion * tasaCesantia * dias;

  const patInfonavit = baseCotizacion * P_PATRON_INFONAVIT * dias;

  let extraEmployerCost = 0;
  if (isMinimumWage) {
    extraEmployerCost =
      (baseExcedente * P_OBRERO_EXCEDENTE * dias) +
      (baseCotizacion * (P_OBRERO_PREST_DINERO + P_OBRERO_GASTOS_MED + P_OBRERO_INVALIDEZ + P_OBRERO_CESANTIA) * dias);
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
    extraEmployerCost;

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
      cesantiaRate: tasaCesantia,
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
