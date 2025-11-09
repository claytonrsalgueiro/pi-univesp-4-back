'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { format } from 'date-fns';

type Point = {
  period: string;
  temperatureAvg: number | null;
  windSpeedAvg: number | null;
  precipitationSum: number | null;
  humidityAvg: number | null;
};
type ChartResponse = { granularity: 'HOURLY' | 'DAILY' | 'AUTO'; data: Point[] };

// Config: meta/limite de precipitação para a linha de referência (mm)
const PRECIP_TARGET_MM = 50;

// chaves numéricas do Point
type NumericKey = 'temperatureAvg' | 'windSpeedAvg' | 'precipitationSum' | 'humidityAvg';

export default function GraficosPage() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [resp, setResp] = useState<ChartResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!start || !end) return;
      const qs = new URLSearchParams({
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
        granularity: 'AUTO'
      });
      const r = await fetch(`/meteo/api/weather/charts?${qs.toString()}`);
      const j: ChartResponse = await r.json();
      setResp(j);
    };
    load();
  }, [start, end]);

  const labels = resp?.data?.map((p) => p.period?.replace('T', ' ')) ?? [];

  // Sempre retorna number[]
  const toNumSeries = (key: NumericKey): number[] =>
    resp?.data?.map((p) => (typeof p[key] === 'number' ? (p[key] as number) : 0)) ?? [];

  // ---- Séries base ----
  const tempData = useMemo(
    () => ({
      labels,
      datasets: [{ type: 'line', label: 'Temperatura (°C)', data: toNumSeries('temperatureAvg') }]
    }),
    [labels, resp]
  );

  const ventoData = useMemo(
    () => ({
      labels,
      datasets: [{ type: 'bar', label: 'Velocidade do Vento (m/s)', data: toNumSeries('windSpeedAvg') }]
    }),
    [labels, resp]
  );

  // ---- Precipitação: hyetograma (acumulada) + linha de referência ----
  const precipCumulative = useMemo(() => {
    const serie = toNumSeries('precipitationSum');
    let acc = 0;
    return serie.map((x) => (acc += x));
  }, [resp]);

  const precipTargetLine = useMemo(
    () => labels.map(() => PRECIP_TARGET_MM),
    [labels]
  );

  const precipData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Precipitação acumulada (mm)',
          data: precipCumulative,
          fill: true,
          tension: 0.3
        },
        {
          type: 'line',
          label: `Meta / Referência (${PRECIP_TARGET_MM} mm)`,
          data: precipTargetLine,
          fill: false,
          borderDash: [8, 6],
          pointRadius: 0
        }
      ]
    }),
    [labels, precipCumulative, precipTargetLine]
  );

  // ---- Umidade: área + linha de temperatura (contexto) ----
  const umiData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: 'line',
          label: 'Umidade (%) [área]',
          data: toNumSeries('humidityAvg'),
          fill: true,
          tension: 0.3
        },
        {
          type: 'line',
          label: 'Temperatura (°C)',
          data: toNumSeries('temperatureAvg'),
          fill: false,
          tension: 0.25
        }
      ]
    }),
    [labels, resp]
  );

  // Rótulo do período/granularidade
  const rangeLabel = useMemo(() => {
    if (!start || !end) return '';
    const de = format(start, 'dd/MM/yyyy');
    const ate = format(end, 'dd/MM/yyyy');
    const gran =
      resp?.granularity === 'HOURLY'
        ? 'por hora'
        : resp?.granularity === 'DAILY'
        ? 'por dia'
        : 'auto';
    return `Período: ${de} → ${ate} (${gran})`;
  }, [start, end, resp?.granularity]);

  // Opções base
  const baseOpts = useMemo(
    () => ({
      maintainAspectRatio: false,
      responsive: true,
      plugins: { legend: { position: 'top' as const } },
      scales: {
        x: { ticks: { maxRotation: 0, autoSkip: true } },
        y: { beginAtZero: true }
      }
    }),
    []
  );

  const withTitle = (title: string) => ({
    ...baseOpts,
    plugins: {
      ...baseOpts.plugins,
      title: { display: true, text: title, font: { size: 18, weight: 'bold' }, padding: { bottom: 10 } }
    }
  });

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-2xl font-semibold mb-3">Análise Gráfica de Dados</h2>

      {/* Filtros */}
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block mb-1 font-medium">Data inicial</label>
          <Calendar value={start} onChange={(e) => setStart(e.value as Date)} dateFormat="dd/mm/yy" showIcon />
        </div>
        <div>
          <label className="block mb-1 font-medium">Data final</label>
          <Calendar value={end} onChange={(e) => setEnd(e.value as Date)} dateFormat="dd/mm/yy" showIcon />
        </div>
      </div>

      {start && end && <p className="text-sm text-gray-500 mt-3">{rangeLabel}</p>}

      {/* Grade 2x2 garantida via CSS local (2 por linha em >=768px) */}
      <div className="charts-grid mt-6">
        <div className="chart-card">
          <Chart type="line" data={tempData} options={withTitle('Temperatura Média (°C)')} className="w-full h-full" />
        </div>

        <div className="chart-card">
          <Chart type="bar" data={ventoData} options={withTitle('Velocidade Média do Vento (m/s)')} className="w-full h-full" />
        </div>

        <div className="chart-card">
          <Chart data={precipData} options={withTitle('Precipitação Acumulada (mm) — Hyetograma + Meta')} className="w-full h-full" />
        </div>

        <div className="chart-card">
          <Chart data={umiData} options={withTitle('Umidade (%) — Área + Temperatura (°C)')} className="w-full h-full" />
        </div>
      </div>

      {/* CSS local para garantir 2 por linha */}
      <style jsx>{`
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr 1fr; /* 2 por linha */
          }
        }
        .chart-card {
          width: 100%;
          height: 460px;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
