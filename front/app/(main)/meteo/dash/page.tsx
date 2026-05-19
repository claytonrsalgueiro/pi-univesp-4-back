'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { Message } from 'primereact/message';
import { format } from 'date-fns';

type DashboardResponse = {
  startDate: string;
  endDate: string;
  temperatureAvg: number | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
  precipitationSum: number | null;
  humidityAvg: number | null;
  windSpeedAvg: number | null;
  windSpeedMax: number | null;
};

type TemperatureRangePoint = {
  period: string;
  temperatureMin: number | null;
  temperatureAvg: number | null;
  temperatureMax: number | null;
};

type TemperatureRangeResponse = {
  granularity: 'DAILY';
  data: TemperatureRangePoint[];
};

type SolarRadiationPoint = {
  period: string;
  solarRadiationAvg: number | null;
  solarEnergySum: number | null;
};

type SolarRadiationResponse = {
  granularity: 'HOURLY' | 'DAILY' | 'AUTO';
  data: SolarRadiationPoint[];
};

const DASHBOARD_CARDS: Array<{
  key: keyof Pick<
    DashboardResponse,
    'temperatureAvg' | 'temperatureMin' | 'temperatureMax' | 'precipitationSum' | 'humidityAvg' | 'windSpeedAvg' | 'windSpeedMax'
  >;
  label: string;
  icon: string;
  suffix: string;
}> = [
  { key: 'temperatureAvg', label: 'Temperatura média', icon: 'pi pi-sun', suffix: ' °C' },
  { key: 'temperatureMax', label: 'Temperatura máxima', icon: 'pi pi-angle-double-up', suffix: ' °C' },
  { key: 'temperatureMin', label: 'Temperatura mínima', icon: 'pi pi-angle-double-down', suffix: ' °C' },
  { key: 'precipitationSum', label: 'Chuva acumulada', icon: 'pi pi-cloud', suffix: ' mm' },
  { key: 'humidityAvg', label: 'Umidade média', icon: 'pi pi-eye', suffix: ' %' },
  { key: 'windSpeedAvg', label: 'Vento médio', icon: 'pi pi-send', suffix: ' m/s' },
  { key: 'windSpeedMax', label: 'Maior velocidade', icon: 'pi pi-bolt', suffix: ' m/s' }
];

export default function DashPage() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [tempRangeResp, setTempRangeResp] = useState<TemperatureRangeResponse | null>(null);
  const [solarResp, setSolarResp] = useState<SolarRadiationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!start || !end) return;

      const baseQs = new URLSearchParams({
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
      });

      const chartQs = new URLSearchParams(baseQs);
      chartQs.set('granularity', 'AUTO');

      setLoading(true);
      setError(null);

      try {
        const [dashboardRes, tempRangeRes, solarRes] = await Promise.all([
          fetch(`/meteo/api/weather/dashboard?${baseQs.toString()}`),
          fetch(`/meteo/api/weather/charts/temperature-range?${baseQs.toString()}`),
          fetch(`/meteo/api/weather/charts/solar-radiation?${chartQs.toString()}`)
        ]);

        if (!dashboardRes.ok) {
          throw new Error('Não foi possível carregar o dashboard.');
        }

        if (!tempRangeRes.ok) {
          throw new Error('Não foi possível carregar o gráfico térmico diário.');
        }

        if (!solarRes.ok) {
          throw new Error('Não foi possível carregar o gráfico de radiação solar.');
        }

        const [dashboardJson, tempRangeJson, solarJson]: [DashboardResponse, TemperatureRangeResponse, SolarRadiationResponse] = await Promise.all([
          dashboardRes.json(),
          tempRangeRes.json(),
          solarRes.json()
        ]);

        setDashboard(dashboardJson);
        setTempRangeResp(tempRangeJson);
        setSolarResp(solarJson);
      } catch (err: any) {
        setDashboard(null);
        setTempRangeResp(null);
        setSolarResp(null);
        setError(err?.message || 'Não foi possível carregar os dados do painel.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [start, end]);

  const formatMetric = (value: number | null | undefined, suffix: string) => {
    if (value == null || Number.isNaN(value)) return '--';
    return `${value.toFixed(2)}${suffix}`;
  };

  const tempRangeLabels = tempRangeResp?.data?.map((point) => point.period?.replace('T', ' ')) ?? [];
  const solarLabels = solarResp?.data?.map((point) => point.period?.replace('T', ' ')) ?? [];

  const tempRangeData = useMemo(
    () => ({
      labels: tempRangeLabels,
      datasets: [
        {
          type: 'line',
          label: 'Temperatura mínima (°C)',
          data: tempRangeResp?.data?.map((point) => point.temperatureMin ?? 0) ?? [],
          borderColor: '#2563eb',
          backgroundColor: '#2563eb'
        },
        {
          type: 'line',
          label: 'Temperatura média (°C)',
          data: tempRangeResp?.data?.map((point) => point.temperatureAvg ?? 0) ?? [],
          borderColor: '#f59e0b',
          backgroundColor: '#f59e0b'
        },
        {
          type: 'line',
          label: 'Temperatura máxima (°C)',
          data: tempRangeResp?.data?.map((point) => point.temperatureMax ?? 0) ?? [],
          borderColor: '#dc2626',
          backgroundColor: '#dc2626'
        }
      ]
    }),
    [tempRangeLabels, tempRangeResp]
  );

  const solarCumulative = useMemo(() => {
    const series = solarResp?.data?.map((point) => point.solarEnergySum ?? 0) ?? [];
    let acc = 0;
    return series.map((value) => (acc += value));
  }, [solarResp]);

  const solarData = useMemo(
    () => ({
      labels: solarLabels,
      datasets: [
        {
          type: 'bar',
          label: 'Radiação média (W/m²)',
          data: solarResp?.data?.map((point) => point.solarRadiationAvg ?? 0) ?? [],
          backgroundColor: '#f59e0b',
          borderColor: '#f59e0b',
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: 'Energia acumulada (kJ/m²)',
          data: solarCumulative,
          borderColor: '#7c3aed',
          backgroundColor: '#7c3aed',
          tension: 0.25,
          yAxisID: 'y1'
        }
      ]
    }),
    [solarLabels, solarResp, solarCumulative]
  );

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

  const solarOpts = useMemo(
    () => ({
      ...withTitle('Radiação Solar Média e Energia Acumulada'),
      scales: {
        x: { ticks: { maxRotation: 0, autoSkip: true } },
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Radiação média (W/m²)' }
        },
        y1: {
          beginAtZero: true,
          position: 'right' as const,
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Energia acumulada (kJ/m²)' }
        }
      }
    }),
    [baseOpts]
  );

  const rangeLabel = useMemo(() => {
    if (!start || !end) return '';
    return `Período: ${format(start, 'dd/MM/yyyy')} até ${format(end, 'dd/MM/yyyy')}`;
  }, [start, end]);

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-2xl font-semibold mb-3">Consolidados</h2>

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
      {error && <Message className="mt-3" severity="error" text={error} />}

      {!start || !end ? (
        <Message className="mt-4" severity="warn" text="Selecione uma data inicial e uma data final para visualizar o painel." />
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 mt-6">
            {DASHBOARD_CARDS.map((card) => (
              <div
                key={card.key}
                className="surface-card border-round-xl p-4 shadow-2 border-1 surface-border"
              >
                <div className="flex items-start justify-content-between gap-3">
                  <div>
                    <div className="text-600 text-sm mb-2">{card.label}</div>
                    <div className="text-900 text-2xl font-semibold">
                      {loading ? 'Carregando...' : formatMetric(dashboard?.[card.key], card.suffix)}
                    </div>
                  </div>
                  <span className="inline-flex align-items-center justify-content-center border-circle bg-primary text-white w-3rem h-3rem">
                    <i className={`${card.icon} text-base`} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="charts-grid mt-6">
            <div className="chart-card">
              <Chart type="line" data={tempRangeData} options={withTitle('Temperatura Mínima, Média e Máxima por Dia')} className="w-full h-full" />
            </div>

            <div className="chart-card">
              <Chart data={solarData} options={solarOpts} className="w-full h-full" />
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1200px) {
          .charts-grid {
            grid-template-columns: 1fr 1fr;
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
