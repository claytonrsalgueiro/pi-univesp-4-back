package br.com.piunivesp.interfaces.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponseDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private Double temperatureAvg;
    private Double temperatureMin;
    private Double temperatureMax;
    private Double precipitationSum;
    private Double humidityAvg;
    private Double windSpeedAvg;
    private Double windSpeedMax;
}
