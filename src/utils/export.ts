import * as XLSX from 'xlsx';
import { PayrollPeriod } from './nominas';

export const exportPayrollToExcel = (periods: PayrollPeriod[], year: number = 2026) => {
  // 1. Prepare data rows
  const data = periods.map(p => ({
    'Periodo': p.label,
    'Sueldo Bruto': p.grossSalary,
    'Ingresos Exentos': p.exemptIncome,
    'Ingresos Gravados': p.taxableIncome,
    'ISR': p.isr,
    'Subsidio': p.subsidioEmpleo,
    'IMSS Obrero Total': p.imssEmployee,
    'IMSS Obrero (E y M)': p.imssBreakdown.employee.gastosMedicos + 
                           p.imssBreakdown.employee.prestacionesDinero + 
                           p.imssBreakdown.employee.excedente,
    'IMSS Obrero (I y V)': p.imssBreakdown.employee.invalidezVida,
    'IMSS Obrero (Cesantía)': p.imssBreakdown.employee.cesantia,
    'Neto a Pagar': p.netSalary,
    'IMSS Patronal Total': p.imssEmployer,
    'IMSS Pat. (Cuota Fija)': p.imssBreakdown.employer.cuotaFija,
    'IMSS Pat. (E y M)': p.imssBreakdown.employer.excedente + 
                         p.imssBreakdown.employer.prestacionesDinero + 
                         p.imssBreakdown.employer.gastosMedicos,
    'IMSS Pat. (Riesgo)': p.imssBreakdown.employer.riesgoTrabajo,
    'IMSS Pat. (I y V)': p.imssBreakdown.employer.invalidezVida,
    'IMSS Pat. (Guarderías)': p.imssBreakdown.employer.guarderias,
    'IMSS Pat. (Retiro)': p.imssBreakdown.employer.retiro,
    'IMSS Pat. (Cesantía)': p.imssBreakdown.employer.cesantia,
    'Infonavit': p.infonavitEmployer,
    'ISN': p.isn,
    'Costo Total Patronal': p.totalEmployerCost
  }));

  // 2. Add Totals Row
  const totals = periods.reduce((acc, p) => ({
    'Periodo': 'TOTAL',
    'Sueldo Bruto': acc['Sueldo Bruto'] + p.grossSalary,
    'Ingresos Exentos': acc['Ingresos Exentos'] + p.exemptIncome,
    'Ingresos Gravados': acc['Ingresos Gravados'] + p.taxableIncome,
    'ISR': acc['ISR'] + p.isr,
    'Subsidio': acc['Subsidio'] + p.subsidioEmpleo,
    'IMSS Obrero Total': acc['IMSS Obrero Total'] + p.imssEmployee,
    'IMSS Obrero (E y M)': acc['IMSS Obrero (E y M)'] + (p.imssBreakdown.employee.gastosMedicos + 
                           p.imssBreakdown.employee.prestacionesDinero + 
                           p.imssBreakdown.employee.excedente),
    'IMSS Obrero (I y V)': acc['IMSS Obrero (I y V)'] + p.imssBreakdown.employee.invalidezVida,
    'IMSS Obrero (Cesantía)': acc['IMSS Obrero (Cesantía)'] + p.imssBreakdown.employee.cesantia,
    'Neto a Pagar': acc['Neto a Pagar'] + p.netSalary,
    'IMSS Patronal Total': acc['IMSS Patronal Total'] + p.imssEmployer,
    'IMSS Pat. (Cuota Fija)': acc['IMSS Pat. (Cuota Fija)'] + p.imssBreakdown.employer.cuotaFija,
    'IMSS Pat. (E y M)': acc['IMSS Pat. (E y M)'] + (p.imssBreakdown.employer.excedente + 
                         p.imssBreakdown.employer.prestacionesDinero + 
                         p.imssBreakdown.employer.gastosMedicos),
    'IMSS Pat. (Riesgo)': acc['IMSS Pat. (Riesgo)'] + p.imssBreakdown.employer.riesgoTrabajo,
    'IMSS Pat. (I y V)': acc['IMSS Pat. (I y V)'] + p.imssBreakdown.employer.invalidezVida,
    'IMSS Pat. (Guarderías)': acc['IMSS Pat. (Guarderías)'] + p.imssBreakdown.employer.guarderias,
    'IMSS Pat. (Retiro)': acc['IMSS Pat. (Retiro)'] + p.imssBreakdown.employer.retiro,
    'IMSS Pat. (Cesantía)': acc['IMSS Pat. (Cesantía)'] + p.imssBreakdown.employer.cesantia,
    'Infonavit': acc['Infonavit'] + p.infonavitEmployer,
    'ISN': acc['ISN'] + p.isn,
    'Costo Total Patronal': acc['Costo Total Patronal'] + p.totalEmployerCost
  }), {
    'Periodo': 'TOTAL',
    'Sueldo Bruto': 0,
    'Ingresos Exentos': 0,
    'Ingresos Gravados': 0,
    'ISR': 0,
    'Subsidio': 0,
    'IMSS Obrero Total': 0,
    'IMSS Obrero (E y M)': 0,
    'IMSS Obrero (I y V)': 0,
    'IMSS Obrero (Cesantía)': 0,
    'Neto a Pagar': 0,
    'IMSS Patronal Total': 0,
    'IMSS Pat. (Cuota Fija)': 0,
    'IMSS Pat. (E y M)': 0,
    'IMSS Pat. (Riesgo)': 0,
    'IMSS Pat. (I y V)': 0,
    'IMSS Pat. (Guarderías)': 0,
    'IMSS Pat. (Retiro)': 0,
    'IMSS Pat. (Cesantía)': 0,
    'Infonavit': 0,
    'ISN': 0,
    'Costo Total Patronal': 0
  });

  data.push(totals);

  // 3. Create Workbook and Worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Nomina');

  // 4. Generate and trigger download
  XLSX.writeFile(workbook, `Nomina_Anual_${year}.xlsx`);
};
