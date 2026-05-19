package br.com.piunivesp.domain;
import br.com.piunivesp.interfaces.dto.ChartSeriesDTO;
import br.com.piunivesp.interfaces.dto.DashboardResponseDTO;
import br.com.piunivesp.interfaces.dto.ExtremesResponseDTO;
import br.com.piunivesp.interfaces.dto.SolarRadiationChartDTO;
import br.com.piunivesp.interfaces.dto.SummaryResponseDTO;
import br.com.piunivesp.interfaces.dto.TemperatureRangeChartDTO;
import br.com.piunivesp.interfaces.dto.UploadResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

public interface WeatherService {
    UploadResponseDTO uploadTOA5(MultipartFile file) throws IOException;
    SummaryResponseDTO summary(LocalDate startDate, LocalDate endDate, Granularity granularity);
    DashboardResponseDTO dashboard(LocalDate startDate, LocalDate endDate);
    ExtremesResponseDTO extremes(LocalDate startDate, LocalDate endDate);
    byte[] exportExcel(LocalDate startDate, LocalDate endDate, Granularity granularity);
    ChartSeriesDTO chart(LocalDate startDate, LocalDate endDate, Granularity granularity);
    TemperatureRangeChartDTO temperatureRange(LocalDate startDate, LocalDate endDate);
    SolarRadiationChartDTO solarRadiation(LocalDate startDate, LocalDate endDate, Granularity granularity);
}

