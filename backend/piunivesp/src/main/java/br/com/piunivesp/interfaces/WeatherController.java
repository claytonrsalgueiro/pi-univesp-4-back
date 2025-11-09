package br.com.piunivesp.interfaces;

import br.com.piunivesp.domain.Granularity;
import br.com.piunivesp.domain.WeatherService;
import br.com.piunivesp.interfaces.dto.ChartSeriesDTO;
import br.com.piunivesp.interfaces.dto.SummaryResponseDTO;
import br.com.piunivesp.interfaces.dto.UploadResponseDTO;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService service;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponseDTO upload(@RequestPart("file") MultipartFile file) throws IOException {
        return service.uploadTOA5(file);
    }

    @GetMapping("/summary")
    public SummaryResponseDTO summary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(defaultValue = "AUTO") Granularity granularity
    ) {
        return service.summary(start, end, granularity);
    }

    @GetMapping("/charts")
    public ChartSeriesDTO charts(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(defaultValue = "AUTO") Granularity granularity
    ) {
        return service.chart(start, end, granularity);
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(
            @RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam(defaultValue = "AUTO") Granularity granularity
    ) {
        byte[] excel = service.exportExcel(start, end, granularity);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=consolidados.xlsx")
                .body(excel);
    }
}

