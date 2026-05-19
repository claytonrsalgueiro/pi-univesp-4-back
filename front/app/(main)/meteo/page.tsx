'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Message } from 'primereact/message';
import { format } from 'date-fns';

type SummaryPoint = {
  period: string;
  temperatureAvg: number | null;
  windSpeedAvg: number | null;
  precipitationSum: number | null;
  humidityAvg: number | null;
};

type SummaryResponse = {
  granularity: 'HOURLY' | 'DAILY' | 'AUTO';
  points: SummaryPoint[];
};

export default function MeteoPage() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [data, setData] = useState<SummaryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buildQuery = () => {
    if (!start || !end) return null;

    return new URLSearchParams({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      granularity: 'AUTO'
    });
  };

  const fetchSummary = async () => {
    const qs = buildQuery();
    if (!qs) return;

    setLoading(true);
    try {
      const res = await fetch(`/meteo/api/weather/summary?${qs.toString()}`);
      if (!res.ok) {
        throw new Error('Não foi possível carregar os dados consolidados.');
      }

      const json: SummaryResponse = await res.json();
      setData(json.points ?? []);
    } catch (err: any) {
      setData([]);
      setError(err?.message || 'Não foi possível carregar os dados consolidados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!start || !end) return;

    setError(null);
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  const onUpload = async (e: FileUploadSelectEvent) => {
    const file = e.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/meteo/api/weather/upload', { method: 'POST', body: form });
    if (res.ok) {
      const json = await res.json();
      setMsg(`Ingestão concluída: ${json.rowsIngested} linhas.`);

      if (start && end) {
        setError(null);
        fetchSummary();
      }
    } else {
      setMsg('Falha no upload/processamento.');
    }
  };

  const onExport = () => {
    const qs = buildQuery();
    if (!qs) return;

    window.location.href = `/meteo/api/weather/export?${qs.toString()}`;
  };

  const tableHeader = useMemo(() => (
    <div className="flex items-end justify-between gap-4 w-full">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col">
          <label className="text-sm mb-1">Data inicial:</label>
          <Calendar
            value={start}
            onChange={(e) => setStart(e.value as Date)}
            dateFormat="dd/mm/yy"
            showIcon
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">Data final:</label>
          <Calendar
            value={end}
            onChange={(e) => setEnd(e.value as Date)}
            dateFormat="dd/mm/yy"
            showIcon
          />
        </div>
      </div>

      <div className="ml-auto">
        <Button
          label="Exportar Excel"
          icon="pi pi-download"
          onClick={onExport}
          disabled={!start || !end}
        />
      </div>
    </div>
  ), [start, end]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Importar Dados - Equipamento TOA5</h2>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <FileUpload
            name="file"
            customUpload
            uploadHandler={() => { }}
            onSelect={onUpload}
            chooseLabel="Selecionar"
          />
        </div>
      </div>

      {msg && <Message className="mt-3" severity="info" text={msg} />}
      {error && <Message className="mt-3" severity="error" text={error} />}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Extração de Informações Processadas</h2>

        <DataTable
          value={data}
          loading={loading}
          paginator
          rows={25}
          className="mt-6"
          header={tableHeader}
        >
          <Column field="period" header="Período" body={(point: SummaryPoint) => point.period?.replace('T', ' ')} sortable />
          <Column field="temperatureAvg" header="Temp média (°C)" sortable />
          <Column field="windSpeedAvg" header="Vento médio (m/s)" sortable />
          <Column field="precipitationSum" header="Precipitação (mm)" sortable />
          <Column field="humidityAvg" header="Umidade média (%)" sortable />
        </DataTable>
      </div>
    </div>
  );
}
