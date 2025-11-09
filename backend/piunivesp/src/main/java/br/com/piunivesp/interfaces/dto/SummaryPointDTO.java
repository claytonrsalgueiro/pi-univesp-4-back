package br.com.piunivesp.interfaces.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SummaryPointDTO {
    private LocalDateTime period;
    private Double temperatureAvg;
    private Double windSpeedAvg;
    private Double precipitationSum;
    private Double humidityAvg;
}

