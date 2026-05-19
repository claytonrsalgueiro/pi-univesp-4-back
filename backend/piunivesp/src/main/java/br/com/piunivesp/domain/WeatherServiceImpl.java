package br.com.piunivesp.domain;

import br.com.piunivesp.interfaces.dto.ChartSeriesDTO;
import br.com.piunivesp.interfaces.dto.DashboardResponseDTO;
import br.com.piunivesp.interfaces.dto.ExtremePointDTO;
import br.com.piunivesp.interfaces.dto.ExtremesResponseDTO;
import br.com.piunivesp.interfaces.dto.SolarRadiationChartDTO;
import br.com.piunivesp.interfaces.dto.SolarRadiationPointDTO;
import br.com.piunivesp.interfaces.dto.SummaryPointDTO;
import br.com.piunivesp.interfaces.dto.SummaryResponseDTO;
import br.com.piunivesp.interfaces.dto.TemperatureRangeChartDTO;
import br.com.piunivesp.interfaces.dto.TemperatureRangePointDTO;
import br.com.piunivesp.interfaces.dto.UploadResponseDTO;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService {

    private final WeatherRecordRepository repo;
    private static final int HEADER_LINES = 4;
    private static final DateTimeFormatter TS_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public UploadResponseDTO uploadTOA5(MultipartFile file) {
        long count = 0;
        try (var reader = new CSVReader(new InputStreamReader(file.getInputStream(), StandardCharsets.ISO_8859_1))) {
            // pula cabeçalhos
            for (int i = 0; i < HEADER_LINES; i++) reader.readNext();

            List<WeatherRecord> batch = new ArrayList<>(2000);
            String[] row;
            while ((row = reader.readNext()) != null) {
                // Esperado:
                // 0: TIMESTAMP, 1: RECORD, 2: VelVent_ms, 3: DirVent, 4: RadW, 5: RadFlukJ_Tot,
                // 6: Temp, 7: UR, 8: Press_mbar, 9: Chuva_mm_Tot
                if (row.length < 10) continue;

                LocalDateTime ts = LocalDateTime.parse(strip(row[0]), TS_FMT);
                Integer rec = parseInt(row[1]);

                WeatherRecord wr = WeatherRecord.builder()
                        .timestamp(ts)
                        .recordNo(rec)
                        .windSpeedMs(parseD(row[2]))
                        .windDirDeg(parseD(row[3]))
                        .solarRadWm2(parseD(row[4]))
                        .solarFluxKJTot(parseD(row[5]))
                        .temperatureC(parseD(row[6]))
                        .humidityPct(parseD(row[7]))
                        .pressureMbar(parseD(row[8]))
                        .precipitationMmTot(parseD(row[9]))
                        .build();

                batch.add(wr);
                if (batch.size() >= 2000) {
                    repo.saveAll(batch);
                    count += batch.size();
                    batch.clear();
                }
            }
            if (!batch.isEmpty()) {
                repo.saveAll(batch);
                count += batch.size();
            }
            return UploadResponseDTO.builder()
                    .rowsIngested(count)
                    .message("Upload/ingestão concluídos com sucesso.")
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Falha ao processar arquivo TOA5: " + e.getMessage(), e);
        }
    }

    @Override
    public SummaryResponseDTO summary(LocalDate startDate, LocalDate endDate, Granularity granularity) {
        var gran = resolveGranularity(startDate, endDate, granularity);
        var start = startDate.atStartOfDay();
        var end = endDate.atTime(LocalTime.MAX);

        List<Map<String, Object>> rows = (gran == Granularity.HOURLY)
                ? repo.aggregateHourly(start, end)
                : repo.aggregateDaily(start, end);

        List<SummaryPointDTO> points = rows.stream().map(m -> SummaryPointDTO.builder()
                        .period(LocalDateTime.parse(m.get("period").toString(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                        .temperatureAvg(getD(m.get("temperatureAvg")))
                        .windSpeedAvg(getD(m.get("windSpeedAvg")))
                        .precipitationSum(getD(m.get("precipitationSum")))
                        .humidityAvg(getD(m.get("humidityAvg")))
                        .build())
                .collect(Collectors.toList());

        return SummaryResponseDTO.builder()
                .granularity(gran.name())
                .points(points)
                .build();
    }

    @Override
    public DashboardResponseDTO dashboard(LocalDate startDate, LocalDate endDate) {
        var start = startDate.atStartOfDay();
        var end = endDate.atTime(LocalTime.MAX);
        var row = repo.aggregateDashboard(start, end);

        return DashboardResponseDTO.builder()
                .startDate(startDate)
                .endDate(endDate)
                .temperatureAvg(getD(row.get("temperatureAvg")))
                .temperatureMin(getD(row.get("temperatureMin")))
                .temperatureMax(getD(row.get("temperatureMax")))
                .precipitationSum(getD(row.get("precipitationSum")))
                .humidityAvg(getD(row.get("humidityAvg")))
                .windSpeedAvg(getD(row.get("windSpeedAvg")))
                .windSpeedMax(getD(row.get("windSpeedMax")))
                .build();
    }

    @Override
    public ExtremesResponseDTO extremes(LocalDate startDate, LocalDate endDate) {
        var start = startDate.atStartOfDay();
        var end = endDate.atTime(LocalTime.MAX);

        return ExtremesResponseDTO.builder()
                .startDate(startDate)
                .endDate(endDate)
                .hottestDay(toExtreme("Dia mais quente", repo.hottestDay(start, end), "°C"))
                .coldestDay(toExtreme("Dia mais frio", repo.coldestDay(start, end), "°C"))
                .rainPeakHour(toExtreme("Hora de maior chuva", repo.rainPeakHour(start, end), "mm"))
                .windPeakMoment(toExtreme("Horário de maior vento", repo.windPeakMoment(start, end), "m/s"))
                .humidityMin(toExtreme("Menor umidade", repo.humidityMin(start, end), "%"))
                .humidityMax(toExtreme("Maior umidade", repo.humidityMax(start, end), "%"))
                .build();
    }

    @Override
    public ChartSeriesDTO chart(LocalDate startDate, LocalDate endDate, Granularity granularity) {
        var s = summary(startDate, endDate, granularity);
        return ChartSeriesDTO.builder()
                .granularity(s.getGranularity())
                .data(s.getPoints())
                .build();
    }

    @Override
    public TemperatureRangeChartDTO temperatureRange(LocalDate startDate, LocalDate endDate) {
        var start = startDate.atStartOfDay();
        var end = endDate.atTime(LocalTime.MAX);

        var rows = repo.aggregateTemperatureRangeDaily(start, end);
        var points = rows.stream().map(row -> TemperatureRangePointDTO.builder()
                        .period(LocalDateTime.parse(row.get("period").toString(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                        .temperatureMin(getD(row.get("temperatureMin")))
                        .temperatureAvg(getD(row.get("temperatureAvg")))
                        .temperatureMax(getD(row.get("temperatureMax")))
                        .build())
                .collect(Collectors.toList());

        return TemperatureRangeChartDTO.builder()
                .granularity(Granularity.DAILY.name())
                .data(points)
                .build();
    }

    @Override
    public SolarRadiationChartDTO solarRadiation(LocalDate startDate, LocalDate endDate, Granularity granularity) {
        var gran = resolveGranularity(startDate, endDate, granularity);
        var start = startDate.atStartOfDay();
        var end = endDate.atTime(LocalTime.MAX);

        List<Map<String, Object>> rows = (gran == Granularity.HOURLY)
                ? repo.aggregateSolarHourly(start, end)
                : repo.aggregateSolarDaily(start, end);

        var points = rows.stream().map(row -> SolarRadiationPointDTO.builder()
                        .period(LocalDateTime.parse(row.get("period").toString(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                        .solarRadiationAvg(getD(row.get("solarRadiationAvg")))
                        .solarEnergySum(getD(row.get("solarEnergySum")))
                        .build())
                .collect(Collectors.toList());

        return SolarRadiationChartDTO.builder()
                .granularity(gran.name())
                .data(points)
                .build();
    }

    @Override
    public byte[] exportExcel(LocalDate startDate, LocalDate endDate, Granularity granularity) {
        var s = summary(startDate, endDate, granularity);
        try (var wb = new org.apache.poi.xssf.usermodel.XSSFWorkbook()) {
            var sheet = wb.createSheet("Consolidados");
            int r = 0;
            var header = sheet.createRow(r++);
            header.createCell(0).setCellValue("Período");
            header.createCell(1).setCellValue("Temp média (°C)");
            header.createCell(2).setCellValue("Vento médio (m/s)");
            header.createCell(3).setCellValue("Precipitação (mm)");
            header.createCell(4).setCellValue("Umidade média (%)");

            for (var p : s.getPoints()) {
                var row = sheet.createRow(r++);
                row.createCell(0).setCellValue(p.getPeriod().toString());
                row.createCell(1).setCellValue(nz(p.getTemperatureAvg()));
                row.createCell(2).setCellValue(nz(p.getWindSpeedAvg()));
                row.createCell(3).setCellValue(nz(p.getPrecipitationSum()));
                row.createCell(4).setCellValue(nz(p.getHumidityAvg()));
            }
            for (int i = 0; i <= 4; i++) sheet.autoSizeColumn(i);

            try (var out = new java.io.ByteArrayOutputStream()) {
                wb.write(out);
                return out.toByteArray();
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar Excel: " + e.getMessage(), e);
        }
    }

    private Granularity resolveGranularity(LocalDate s, LocalDate e, Granularity g) {
        if (g != null && g != Granularity.AUTO) return g;
        return s.equals(e) ? Granularity.HOURLY : Granularity.DAILY;
    }

    private static String strip(String s) {
        return s == null ? null : s.replace("\"", "").trim();
    }

    private static Double parseD(String s) {
        try {
            return s == null || s.isBlank() ? null : Double.valueOf(strip(s));
        } catch (Exception e) {
            return null;
        }
    }

    private static Integer parseInt(String s) {
        try {
            return s == null || s.isBlank() ? null : Integer.valueOf(strip(s));
        } catch (Exception e) {
            return null;
        }
    }

    private static Double getD(Object o) {
        return o == null ? null : Double.valueOf(o.toString());
    }

    private static ExtremePointDTO toExtreme(String label, Map<String, Object> row, String unit) {
        if (row == null || row.isEmpty()) {
            return ExtremePointDTO.builder()
                    .label(label)
                    .unit(unit)
                    .build();
        }

        return ExtremePointDTO.builder()
                .label(label)
                .period(row.get("period") == null ? null : row.get("period").toString())
                .value(getD(row.get("value")))
                .unit(unit)
                .build();
    }

    private static double nz(Double d) {
        return d == null ? 0.0 : d;
    }
}
