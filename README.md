# Cobre — Prueba técnica Business Architect

## Descripción

Este proyecto presenta un análisis de 50.000 transacciones y 5.000 usuarios de Cobre, correspondientes al período de julio a diciembre de 2025.

El objetivo es evaluar el desempeño de los corredores de pago, identificar posibles causas de fallos y recomendar un corredor para una estrategia de crecimiento en 2026.

El análisis se desarrolló utilizando SQL y Python. Los resultados se presentan en un notebook de Jupyter, un archivo Excel y un resumen ejecutivo en PDF.

## Estructura del proyecto

| Archivo | Descripción |
|---|---|
| `analysis.ipynb` | Respuestas de las tres partes de la prueba, consultas SQL, cálculos, validaciones y visualizaciones. |
| `cobre_analysis.xlsx` | Tablas e indicadores que respaldan los resultados. |
| `Cobre_Resumen_Ejecutivo.pdf` | Resumen de una página con los principales hallazgos y recomendaciones. |
| `corridor_volume.png` | Gráfico del volumen de transacciones por corredor. |
| `monthly_trend.png` | Gráfico de evolución mensual. |
| `data/` | Archivos originales `transactions.csv` y `users.csv`. |
| `requirements.txt` | Dependencias necesarias para ejecutar el notebook. |

## Organización de las respuestas

**Parte 1. Análisis de datos**

Las diez preguntas sobre desempeño de corredores, comportamiento de usuarios y patrones temporales están respondidas al inicio de `analysis.ipynb`, con resultados, interpretaciones y referencias a las tablas del Excel.

**Parte 2. Análisis de causas raíz**

El notebook presenta los patrones de transacciones fallidas de USD → MXN, tres posibles causas raíz, cómo validarlas y el impacto financiero estimado. Los cálculos y escenarios están documentados en las secciones técnicas y en el Excel.

**Parte 3. Recomendación estratégica**

El notebook incluye la recomendación de USD → COP para un piloto de crecimiento en 2026, su justificación, las acciones propuestas y el impacto esperado, junto con la comparación de los corredores.

El archivo `Cobre_Resumen_Ejecutivo.pdf` reúne los principales hallazgos y recomendaciones en una página, conforme al formato solicitado para la entrega.

## Herramientas utilizadas

- **Python y Pandas:** procesamiento y análisis de datos.
- **DuckDB (SQL):** consultas y agrupaciones.
- **Jupyter Notebook:** desarrollo y ejecución del análisis.
- **Matplotlib:** visualización de resultados.
- **Excel:** presentación de tablas e indicadores.

## Cómo ejecutar el análisis

Desde la carpeta principal del proyecto:

```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```

Abrir `analysis.ipynb` en Jupyter o VS Code, seleccionar el entorno virtual y ejecutar las celdas en orden.

Los archivos CSV originales deben permanecer en la carpeta `data/`.

La ejecución regenera `analysis_results.json` y los gráficos. Para actualizar el Excel, con Node.js y `@oai/artifact-tool` disponibles, ejecutar:

```bash
node export_excel.mjs
```

Para esta exportación deben conservarse `export_excel.mjs` y `evidence_titles.json`. El Excel contiene resultados exportados y no se actualiza automáticamente al ejecutar el notebook. El PDF es un documento de presentación independiente.

## Consideraciones del análisis

Los resultados se calcularon a partir de los archivos proporcionados para la prueba.

El notebook documenta las diferencias entre los campos de segmentación de los CSV, las limitaciones de cobertura temporal y los supuestos utilizados en los escenarios financieros.

Las estimaciones financieras utilizan la comisión hipotética del 0,5 % indicada en el caso y no representan ingresos contables ni ganancias garantizadas.

## Uso de inteligencia artificial

Durante el desarrollo de esta prueba utilicé ChatGPT y Codex como herramientas de apoyo para trabajar con SQL y Python, desarrollar y mejorar scripts, resolver dudas técnicas y organizar los resultados.

Estas herramientas también me ayudaron a revisar el código, detectar posibles inconsistencias, validar cálculos y mejorar la claridad de las explicaciones.

