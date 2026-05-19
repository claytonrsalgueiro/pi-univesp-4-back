'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Message } from 'primereact/message';
import { format } from 'date-fns';

type ExtremePoint = {
  label: string;
  period: string | null;
  value: number | null;
  unit: string;
};

type ExtremesResponse = {
  startDate: string;
  endDate: string;
  hottestDay: ExtremePoint;
  coldestDay: ExtremePoint;
  rainPeakHour: ExtremePoint;
  windPeakMoment: ExtremePoint;
  humidityMin: ExtremePoint;
  humidityMax: ExtremePoint;
};

const EXTREME_KEYS: Array<keyof Pick<
  ExtremesResponse,
  'hottestDay' | 'coldestDay' | 'rainPeakHour' | 'windPeakMoment' | 'humidityMin' | 'humidityMax'
>> = [
  'hottestDay',
  'coldestDay',
  'rainPeakHour',
  'windPeakMoment',
  'humidityMin',
  'humidityMax'
];

export default function ExtremosPage() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [data, setData] = useState<ExtremesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!start || !end) return;

      setLoading(true);
      setError(null);

      const qs = new URLSearchParams({
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
      });

      try {
        const res = await fetch(`/meteo/api/weather/extremes?${qs.toString()}`);
        if (!res.ok) {
          throw new Error('Não foi possível carregar os extremos meteorológicos.');
        }

        const json: ExtremesResponse = await res.json();
        setData(json);
      } catch (err: any) {
        setData(null);
        setError(err?.message || 'Não foi possível carregar os extremos meteorológicos.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [start, end]);

  const periodLabel = useMemo(() => {
    if (!start || !end) return '';
    return `Período selecionado: ${format(start, 'dd/MM/yyyy')} até ${format(end, 'dd/MM/yyyy')}`;
  }, [start, end]);

  const formatValue = (point: ExtremePoint) => {
    if (point.value == null || Number.isNaN(point.value)) return '--';
    return `${point.value.toFixed(2)} ${point.unit}`;
  };

  const formatPeriod = (period: string | null) => {
    if (!period) return 'Sem registro no intervalo.';
    return period.replace('T', ' ');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-3">Extremos Meteorológicos</h2>

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

      {start && end && <p className="text-sm text-gray-500 mt-3">{periodLabel}</p>}
      {error && <Message className="mt-3" severity="error" text={error} />}

      {!start || !end ? (
        <Message className="mt-4" severity="warn" text="Selecione o intervalo para consultar os eventos mais relevantes." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-6">
          {EXTREME_KEYS.map((key) => {
            const point = data?.[key];

            return (
              <div key={key} className="surface-card border-round-xl p-4 shadow-2 border-1 surface-border">
                <div className="text-900 text-lg font-semibold mb-2">
                  {point?.label ?? 'Carregando...'}
                </div>
                <div className="text-3xl font-bold text-primary mb-3">
                  {loading ? 'Carregando...' : point ? formatValue(point) : '--'}
                </div>
                <div className="text-600 text-sm">
                  {loading ? 'Consultando registros...' : point ? formatPeriod(point.period) : 'Sem dados.'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
