// Interfaces
export interface ISRTableRow {
  limiteInferior: number;
  cuotaFija: number;
  porcentaje: number;
}

export interface YearlyConfig {
  umaDiaria: number;
  umaDiariaEnero?: number; // Específico para 2026
  salarioMinimoGeneral: number;
  salarioMinimoFrontera: number;
  tasaIsn: number;
  subsidioMensualTope: number;
  subsidioMensualCantidad: number;
  subsidioMensualCantidadEnero?: number; // Específico para 2026
  subsidioMensualCantidadFebDic?: number; // Específico para 2026
  tablaIsrQuincenal: ISRTableRow[];
  tablaIsrMensual: ISRTableRow[];
  tablaIsrAnual: ISRTableRow[];
}

// Valores 2025
export const CONFIG_2025: YearlyConfig = {
  umaDiaria: 113.14,
  salarioMinimoGeneral: 278.8,
  salarioMinimoFrontera: 419.88,
  tasaIsn: 0.04,
  subsidioMensualTope: 10171.0,
  subsidioMensualCantidad: 474.65,
  tablaIsrQuincenal: [
    { limiteInferior: 0.01, cuotaFija: 0.0, porcentaje: 0.0192 },
    { limiteInferior: 368.11, cuotaFija: 7.05, porcentaje: 0.064 },
    { limiteInferior: 3124.36, cuotaFija: 183.45, porcentaje: 0.1088 },
    { limiteInferior: 5490.76, cuotaFija: 441.0, porcentaje: 0.16 },
    { limiteInferior: 6382.81, cuotaFija: 583.65, porcentaje: 0.1792 },
    { limiteInferior: 7641.91, cuotaFija: 809.25, porcentaje: 0.2136 },
    { limiteInferior: 15412.81, cuotaFija: 2469.15, porcentaje: 0.2352 },
    { limiteInferior: 24292.66, cuotaFija: 4557.75, porcentaje: 0.3 },
    { limiteInferior: 46378.51, cuotaFija: 11183.4, porcentaje: 0.32 },
    { limiteInferior: 61838.11, cuotaFija: 16130.55, porcentaje: 0.34 },
    { limiteInferior: 185514.31, cuotaFija: 58180.35, porcentaje: 0.35 },
  ],
  tablaIsrMensual: [
    { limiteInferior: 0.01, cuotaFija: 0.0, porcentaje: 0.0192 },
    { limiteInferior: 746.05, cuotaFija: 14.32, porcentaje: 0.064 },
    { limiteInferior: 6332.06, cuotaFija: 371.83, porcentaje: 0.1088 },
    { limiteInferior: 11128.02, cuotaFija: 893.63, porcentaje: 0.16 },
    { limiteInferior: 12935.83, cuotaFija: 1182.88, porcentaje: 0.1792 },
    { limiteInferior: 15487.72, cuotaFija: 1640.18, porcentaje: 0.2136 },
    { limiteInferior: 31236.5, cuotaFija: 5004.12, porcentaje: 0.2352 },
    { limiteInferior: 49233.01, cuotaFija: 9236.89, porcentaje: 0.3 },
    { limiteInferior: 93993.91, cuotaFija: 22665.17, porcentaje: 0.32 },
    { limiteInferior: 125325.21, cuotaFija: 32691.18, porcentaje: 0.34 },
    { limiteInferior: 375975.62, cuotaFija: 117912.32, porcentaje: 0.35 },
  ],
  tablaIsrAnual: [
    { limiteInferior: 0.01, cuotaFija: 0.0, porcentaje: 0.0192 },
    { limiteInferior: 8952.5, cuotaFija: 171.88, porcentaje: 0.064 },
    { limiteInferior: 75984.56, cuotaFija: 4461.94, porcentaje: 0.1088 },
    { limiteInferior: 133536.08, cuotaFija: 10723.55, porcentaje: 0.16 },
    { limiteInferior: 155229.81, cuotaFija: 14194.54, porcentaje: 0.1792 },
    { limiteInferior: 185852.58, cuotaFija: 19682.13, porcentaje: 0.2136 },
    { limiteInferior: 374837.89, cuotaFija: 60049.4, porcentaje: 0.2352 },
    { limiteInferior: 590795.99, cuotaFija: 110842.74, porcentaje: 0.3 },
    { limiteInferior: 1127926.91, cuotaFija: 271981.99, porcentaje: 0.32 },
    { limiteInferior: 1503902.46, cuotaFija: 392294.17, porcentaje: 0.34 },
    { limiteInferior: 4511707.37, cuotaFija: 1414947.85, porcentaje: 0.35 },
  ],
};

// Valores 2026 (Actualizados con SM 315.04 y UMA Oficial del INEGI)
export const CONFIG_2026: YearlyConfig = {
  umaDiaria: 117.31,
  umaDiariaEnero: 113.14, // UMA 2025 aplicada en Enero 2026
  salarioMinimoGeneral: 315.04,
  salarioMinimoFrontera: 474.46, // 13% incremento
  tasaIsn: 0.04,
  subsidioMensualTope: 11492.66,
  subsidioMensualCantidad: 535.65, // Valor Feb-Dic
  subsidioMensualCantidadEnero: 536.22,
  subsidioMensualCantidadFebDic: 535.65,
  tablaIsrQuincenal: [
    { limiteInferior: 0.01, cuotaFija: 0.0, porcentaje: 0.0192 },
    { limiteInferior: 416.74, cuotaFija: 8.0, porcentaje: 0.064 },
    { limiteInferior: 3537.09, cuotaFija: 207.7, porcentaje: 0.1088 },
    { limiteInferior: 6216.13, cuotaFija: 499.18, porcentaje: 0.16 },
    { limiteInferior: 7226.04, cuotaFija: 660.69, porcentaje: 0.1792 },
    { limiteInferior: 8651.47, cuotaFija: 916.2, porcentaje: 0.2136 },
    { limiteInferior: 17448.77, cuotaFija: 2795.31, porcentaje: 0.2352 },
    { limiteInferior: 27501.65, cuotaFija: 5159.75, porcentaje: 0.3 },
    { limiteInferior: 52505.18, cuotaFija: 12660.8, porcentaje: 0.32 },
    { limiteInferior: 70006.91, cuotaFija: 18261.36, porcentaje: 0.34 },
    { limiteInferior: 210020.72, cuotaFija: 65866.05, porcentaje: 0.35 },
  ],
  tablaIsrMensual: [
    { limiteInferior: 0.01, cuotaFija: 0.0, porcentaje: 0.0192 },
    { limiteInferior: 844.6, cuotaFija: 16.22, porcentaje: 0.064 },
    { limiteInferior: 7168.52, cuotaFija: 420.95, porcentaje: 0.1088 },
    { limiteInferior: 12598.03, cuotaFija: 1011.68, porcentaje: 0.16 },
    { limiteInferior: 14644.65, cuotaFija: 1339.14, porcentaje: 0.1792 },
    { limiteInferior: 17533.65, cuotaFija: 1856.84, porcentaje: 0.2136 },
    { limiteInferior: 35362.84, cuotaFija: 5665.16, porcentaje: 0.2352 },
    { limiteInferior: 55736.69, cuotaFija: 10457.09, porcentaje: 0.3 },
    { limiteInferior: 106410.51, cuotaFija: 25659.23, porcentaje: 0.32 },
    { limiteInferior: 141880.67, cuotaFija: 37009.69, porcentaje: 0.34 },
    { limiteInferior: 425642.0, cuotaFija: 133488.54, porcentaje: 0.35 },
  ],
  tablaIsrAnual: [
    { limiteInferior: 0.01, cuotaFija: 0, porcentaje: 0.0192 },
    { limiteInferior: 10135.12, cuotaFija: 194.59, porcentaje: 0.064 },
    { limiteInferior: 86022.12, cuotaFija: 5051.37, porcentaje: 0.1088 },
    { limiteInferior: 151176.2, cuotaFija: 12140.13, porcentaje: 0.16 },
    { limiteInferior: 175735.67, cuotaFija: 16069.64, porcentaje: 0.1792 },
    { limiteInferior: 210403.7, cuotaFija: 22282.14, porcentaje: 0.2136 },
    { limiteInferior: 424353.98, cuotaFija: 67981.92, porcentaje: 0.2352 },
    { limiteInferior: 668840.15, cuotaFija: 125485.07, porcentaje: 0.3 },
    { limiteInferior: 1276925.99, cuotaFija: 307910.81, porcentaje: 0.32 },
    { limiteInferior: 1702567.98, cuotaFija: 444116.23, porcentaje: 0.34 },
    { limiteInferior: 5107703.93, cuotaFija: 1601862.46, porcentaje: 0.35 },
  ],
};

// Mantener constantes base para no romper código existente inmediatamente
export const UMA_DIARIA = CONFIG_2025.umaDiaria;
export const SALARIO_MINIMO_GENERAL = CONFIG_2025.salarioMinimoGeneral;
export const SALARIO_MINIMO_FRONTERA = CONFIG_2025.salarioMinimoFrontera;
export const TASA_ISN = CONFIG_2025.tasaIsn;
export const TABLA_ISR_QUINCENAL = CONFIG_2025.tablaIsrQuincenal;
export const TABLA_ISR_MENSUAL = CONFIG_2025.tablaIsrMensual;
export const TABLA_ISR_ANUAL = CONFIG_2025.tablaIsrAnual;
export const SUBSIDIO_MENSUAL_2025_TOPE = CONFIG_2025.subsidioMensualTope;
export const SUBSIDIO_MENSUAL_2025_CANTIDAD = CONFIG_2025.subsidioMensualCantidad;

export const getYearlyConfig = (year: number): YearlyConfig => {
  if (year === 2026) return CONFIG_2026;
  return CONFIG_2025;
};

// Días de Vacaciones por Año (Ley Federal del Trabajo - Reforma Vacaciones Dignas)
export const DIAS_VACACIONES = [
  { anios: 1, dias: 12 },
  { anios: 2, dias: 14 },
  { anios: 3, dias: 16 },
  { anios: 4, dias: 18 },
  { anios: 5, dias: 20 },
  { anios: 6, dias: 22 }, // 6-10 años
  { anios: 11, dias: 24 }, // 11-15 años
  { anios: 16, dias: 26 }, // 16-20 años
  { anios: 21, dias: 28 }, // 21-25 años
  { anios: 26, dias: 30 }, // 26-30 años
  { anios: 31, dias: 32 }, // 31-35 años
];

export const getDiasVacaciones = (aniosAntiguedad: number): number => {
  if (aniosAntiguedad < 1) return 12; // Mínimo legal para el primer año

  const exactMatch = DIAS_VACACIONES.find((v) => v.anios === aniosAntiguedad);
  if (exactMatch) return exactMatch.dias;

  if (aniosAntiguedad >= 6 && aniosAntiguedad <= 10) return 22;
  if (aniosAntiguedad >= 11 && aniosAntiguedad <= 15) return 24;
  if (aniosAntiguedad >= 16 && aniosAntiguedad <= 20) return 26;
  if (aniosAntiguedad >= 21 && aniosAntiguedad <= 25) return 28;
  if (aniosAntiguedad >= 26 && aniosAntiguedad <= 30) return 30;
  if (aniosAntiguedad >= 31) return 32;

  return 12;
};
