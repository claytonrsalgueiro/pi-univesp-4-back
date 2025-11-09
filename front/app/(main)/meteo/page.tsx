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
  period: string; // ISO LocalDateTime
  temperatureAvg: number | null;
  windSpeedAvg: number | null;
  precipitationSum: number | null;
  humidityAvg: number | null;
};
type SummaryResponse = { granularity: 'HOURLY' | 'DAILY' | 'AUTO'; points: SummaryPoint[] };

export default function MeteoPage() {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [data, setData] = useState<SummaryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchSummary = async () => {
    if (!start || !end) return;
    setLoading(true);
    const qs = new URLSearchParams({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      granularity: 'AUTO'
    });
    const res = await fetch(`/meteo/api/weather/summary?${qs.toString()}`);
    const json: SummaryResponse = await res.json();
    setData(json.points ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (start && end) fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  const onUpload = async (e: FileUploadSelectEvent) => {
    const file = e.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/meteo/api/weather/upload', { method: 'POST', body: form });
    if (res.ok) {
      const j = await res.json();
      setMsg(`Ingestão concluída: ${j.rowsIngested} linhas.`);
      if (start && end) fetchSummary();
    } else {
      setMsg('Falha no upload/processamento.');
    }
  };

  const onExport = () => {
    if (!start || !end) return;
    const qs = new URLSearchParams({
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd'),
      granularity: 'AUTO'
    });
    window.location.href = `/meteo/api/weather/export?${qs.toString()}`;
  };

  // Header da DataTable: filtros à esquerda, botão à direita
  const tableHeader = useMemo(() => (
    <div className="flex items-end justify-between gap-4 w-full">
      {/* Lado esquerdo: filtros de data */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col">
          <label className="text-sm mb-1">Data inicial: </label>
          <Calendar
            value={start}
            onChange={(e) => setStart(e.value as Date)}
            dateFormat="dd/mm/yy"
            showIcon
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">Data final: </label>
          <Calendar
            value={end}
            onChange={(e) => setEnd(e.value as Date)}
            dateFormat="dd/mm/yy"
            showIcon
          />
        </div>
      </div>

      {/* Lado direito: botão de exportação */}
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


      <br />      <br />

      <br />
      <h2 className="text-xl font-semibold mb-3">Extração de Informações Processadas</h2>

      <DataTable
        value={data}
        loading={loading}
        paginator
        rows={25}
        className="mt-6"
        header={tableHeader}  // <<-- header customizado
      >
        <Column field="period" header="Período" body={(p) => p.period?.replace('T', ' ')} sortable />
        <Column field="temperatureAvg" header="Temp média (°C)" sortable />
        <Column field="windSpeedAvg" header="Vento médio (m/s)" sortable />
        <Column field="precipitationSum" header="Precipitação (mm)" sortable />
        <Column field="humidityAvg" header="Umidade média (%)" sortable />
      </DataTable>
    </div>
  );
}
