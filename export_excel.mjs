// Exportación visual de los resultados del notebook; no recalcula el análisis.
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
const packageRoot = process.env.COBRE_NODE_MODULES || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const entry = require.resolve('@oai/artifact-tool', { paths: [packageRoot] });
const { Workbook, SpreadsheetFile } = await import(pathToFileURL(entry).href);
const data = JSON.parse(await fs.readFile('analysis_results.json', 'utf8'));
const evidenceTitles = JSON.parse(await fs.readFile('evidence_titles.json', 'utf8'));
const wb = Workbook.create();
const labels = {
 corridor:'Corredor', total_transactions:'Intentos', total_usd:'Valor intentado USD',
 avg_transaction_usd:'Ticket medio USD', successful:'Éxitos', failed:'Fallos', success_rate:'Éxito %',
 user_id:'Usuario', country:'País del usuario', users_with_transactions:'Usuarios con operaciones',
 avg_amount_usd:'Ticket medio USD', registered_users:'Usuarios registrados', active_status_users:'Usuarios status activo',
 avg_transactions_per_registered_user:'Intentos por registrado', day:'Día', observed_dates:'Fechas observadas',
 transactions_per_observed_day:'Intentos por día observado', hour:'Hora original', month:'Mes', observed_days:'Días observados',
 transactions_days_1_30:'Intentos días 1–30', daily_days_1_30:'Intentos diarios días 1–30', change_previous_comparable:'Cambio mes anterior días 1–30 %',
 user_segment:'Segmento', failure_rate:'Fallo %', amount_range:'Rango de importe USD', transactions:'Intentos',
 successful_value:'Valor exitoso USD', estimated_fee_usd_month:'Fee estimado USD mes', jul_days_1_30:'Julio días 1–30',
 dec_days_1_30:'Diciembre días 1–30', comparable_change:'Cambio julio–dic días 1–30 %', decision:'Criterio de decisión'
};
const notes = {
 'Corridor Volume':'Fuente: transactions.csv. Julio–diciembre 2025. Éxitos y fallos; ranking por número de intentos.',
 'Corridor Value':'Fuente: transactions.csv. Valor incluye intentos fallidos; no es volumen liquidado.',
 'Success Rates':'Fuente: transactions.csv. Éxitos / intentos. Tasas almacenadas como proporciones.',
 'Top Users':'Fuente: transactions.csv. Cantidad DESC, user_id ASC. 4 usuarios con 21; 10 empatados con 20. Se muestran 10.',
 'Country Analysis':'Fuentes: users.csv y transactions.csv. País del usuario; JOIN many-to-one. Usuarios con operaciones ≠ status activo.',
 'Weekly':'Fuente: transactions.csv. Ranking bruto y sensibilidad por número de fechas observadas.',
 'Hourly':'Fuente: transactions.csv. Sin zona horaria informada. Horas sin registros se muestran con cero.',
 'Monthly':'Fuente: transactions.csv. Comparación principal días 1–30. Motivo de ausencia del 31-dic desconocido. Primer cambio no aplica.',
 'Failure Segments':'USD→MXN. Segmento del cliente: users.csv. Sin historial; confirmar semántica. Ver Segment Sensitivity.',
 'Failure Amounts':'USD→MXN. Fuente: transactions.csv. Tasa vacía = sin operaciones en el rango; no significa tasa cero.',
 'Failure Days':'USD→MXN. Viernes se incluye por el enunciado; martes tiene la mayor tasa. Las diferencias no prueban causalidad.',
 'Financial Impact':'USD→MXN. Fee supuesto 0,5%. Promedio semestral / 6. Comisión potencial, no pérdida contable.',
 'Corridor Growth':'Fuente: transactions.csv. Se conservan totales y ventanas de 30 días. Sin imputar actividad.',
 'Segment Audit':'JOIN de ambos CSV por user_id. Evidencia de discrepancia; no determina cuál es el segmento histórico.',
 'Segment Sensitivity':'USD→MXN. Segmento de transactions.csv. Sensibilidad operativa; no atribuir a clientes sin confirmar significado.',
 'Financial Scenarios':'USD→MXN. 2.307 recuperaciones; 870 fallos restantes (≤5% semestral). Escenario por valor no define conteo.',
 'Strategy':'Fuentes: ambos CSV. Fee 0,5% sobre valor exitoso / 6. Meta +38 ilustrativa: evaluar frente a fluctuaciones habituales. Mercado, costos y complejidad no medidos.',
 'Methodology':'Definiciones y límites. Resultados estáticos; cálculos reproducibles en analysis.ipynb.',
 'Checks':'Controles del notebook. «Tres indicadores clave» verifica solo dos comisiones y la meta de operaciones; no comprueba todo el informe.'
};
for (const [name,table] of Object.entries(data)) {
 const s=wb.worksheets.add(name);
 const rows=table.data.length, cols=table.columns.length;
 const all=s.getRangeByIndexes(0,0,rows+4,cols);
 all.format.font={name:'Arial',size:11,color:'#172B3A'};
 all.format.verticalAlignment='center';
 s.showGridLines=false;
 s.mergeCells(`A1:${String.fromCharCode(64+cols)}1`);
 s.getRange('A1').values=[[evidenceTitles[name]]];
 s.getRangeByIndexes(0,0,1,cols).format.wrapText=true;
 s.getRangeByIndexes(0,0,1,cols).format.rowHeight=44;
 s.getRange('A1').format.font={name:'Arial',size:15,bold:true,color:'#172B3A'};
 s.mergeCells(`A2:${String.fromCharCode(64+cols)}2`);
 s.getRange('A2').values=[[notes[name]]];
 s.getRangeByIndexes(1,0,1,cols).format.wrapText=true;
 s.getRangeByIndexes(1,0,1,cols).format.rowHeight=48;
 s.getRangeByIndexes(3,0,rows+1,cols).values=[table.columns.map(c=>labels[c]||c),...table.data];
 const header=s.getRangeByIndexes(3,0,1,cols);
 header.format.fill='#245B78';header.format.font={name:'Arial',size:11,bold:true,color:'#FFFFFF'};
 header.format.wrapText=true;header.format.horizontalAlignment='center';header.format.rowHeight=46;
 for(let j=0;j<cols;j++) {
  const col=table.columns[j], r=s.getRangeByIndexes(4,j,rows,1);
  let width=20;
  if (['decision','Criterio','Detalle'].includes(col))width=58;
  if (['Control','Escenario','Medida'].includes(col))width=43;
  if (['amount_range','avg_transactions_per_registered_user','transactions_per_observed_day','change_previous_comparable','comparable_change'].includes(col))width=26;
  if (name==='Methodology' && j===1)width=95;
  if (name==='Methodology' && j===0)width=25;
  s.getRangeByIndexes(0,j,rows+4,1).format.columnWidth=width;
  r.format.wrapText=true;r.format.rowHeight=name==='Methodology'?42:32;
  const numeric=table.data.some(row=>typeof row[j]==='number');
  if(numeric){
   r.format.horizontalAlignment='right';
   let fmt='#,##0';
   if(/rate|change|Proporcion|Tasa fallo|Fee supuesto/.test(col))fmt='0.00%';
   else if(/usd|USD|avg_|per_|daily_|successful_value/.test(col))fmt='#,##0.00';
   r.setNumberFormat(fmt);
  }
 }
 for(let i=0;i<rows;i++)if(i%2===1)s.getRangeByIndexes(i+4,0,1,cols).format.fill='#EFF4F7';
 if(rows>15)s.freezePanes.freezeRows(4);
}
wb.recalculate();
// Solo valores de celda que sean errores completos, no menciones dentro de notas.
const scan=await wb.inspect({kind:'match',searchTerm:'^(#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!)$',options:{useRegex:true,maxResults:10},maxChars:6000});
const cellErrors=scan.ndjson.split('\n').filter(line=>line.trim()).map(line=>JSON.parse(line)).filter(item=>item.kind==='match' && item.match==='value');
if(cellErrors.length){
 throw new Error(`Exportación detenida por errores de celda: ${cellErrors.map(item=>`${item.sheet}!${item.address}: ${item.value}`).join('; ')}`);
}
console.log('Comprobación de errores de celda: sin errores.');
if(process.env.COBRE_PREVIEW_DIR){
 await fs.mkdir(process.env.COBRE_PREVIEW_DIR,{recursive:true});
 for(const [name,table] of Object.entries(data)){
  if(process.env.COBRE_PREVIEW_SHEETS && !process.env.COBRE_PREVIEW_SHEETS.split(',').includes(name))continue;
  const preview=await wb.render({sheetName:name,range:`A1:${String.fromCharCode(64+table.columns.length)}${table.data.length+4}`,scale:1,format:'png'});
  await fs.writeFile(path.join(process.env.COBRE_PREVIEW_DIR,`${name}.png`),new Uint8Array(await preview.arrayBuffer()));
 }
}
const output=await SpreadsheetFile.exportXlsx(wb);
await output.save('cobre_analysis.xlsx');
console.log(`Excel exportado: ${Object.keys(data).length} hojas. Datos y definiciones del notebook.`);
