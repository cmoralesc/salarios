// Valores 2025
export const UMA_DIARIA = 113.14;
export const SALARIO_MINIMO_GENERAL = 278.8;
export const SALARIO_MINIMO_FRONTERA = 419.88;

// Impuesto Sobre Nómina (CDMX)
export const TASA_ISN = 0.04;

// Interfaces
export interface ISRTableRow {
  limiteInferior: number;
  cuotaFija: number;
  porcentaje: number;
}

// Tabla ISR Quincenal 2025 (Datos Oficiales Corregidos)
export const TABLA_ISR_QUINCENAL: ISRTableRow[] = [
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
];

// Tabla ISR Mensual 2025 (Datos Oficiales Corregidos)
export const TABLA_ISR_MENSUAL: ISRTableRow[] = [
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
];

// Tabla ISR Anual 2025 (Datos Oficiales Corregidos)
export const TABLA_ISR_ANUAL: ISRTableRow[] = [
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
];

// Subsidio al Empleo 2025 (Actualizado 1 de mayo 2024 / Ratificado 2025)
// El subsidio ya no es una tabla con rangos, sino una cuota fija (13.8% de UMA Mensual)
// para ingresos que no excedan un límite ($10,171.00 aprox).
// UMA Mensual 2025 = 3,439.46
// Subsidio Mensual = 3,439.46 * 13.8% = 474.65
// Límite Ingreso Mensual = 10,171.00

export const SUBSIDIO_MENSUAL_2025_TOPE = 10171.0;
// Cálculo exacto: 3439.46 * 0.138 = 474.64548
export const SUBSIDIO_MENSUAL_2025_CANTIDAD = 474.65;

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
  if (aniosAntiguedad < 1) return 0; // Proporcional si es menos de un año, pero legalmente se gozan al cumplir el año

  // Buscar rango exacto o rango de años
  const exactMatch = DIAS_VACACIONES.find((v) => v.anios === aniosAntiguedad);
  if (exactMatch) return exactMatch.dias;

  // Lógica para rangos (6-10, 11-15, etc.)
  if (aniosAntiguedad >= 6 && aniosAntiguedad <= 10) return 22;
  if (aniosAntiguedad >= 11 && aniosAntiguedad <= 15) return 24;
  if (aniosAntiguedad >= 16 && aniosAntiguedad <= 20) return 26;
  if (aniosAntiguedad >= 21 && aniosAntiguedad <= 25) return 28;
  if (aniosAntiguedad >= 26 && aniosAntiguedad <= 30) return 30;
  if (aniosAntiguedad >= 31) return 32;

  return 12; // Default fallback
};
