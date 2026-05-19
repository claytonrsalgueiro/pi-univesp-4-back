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
public class ExtremesResponseDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private ExtremePointDTO hottestDay;
    private ExtremePointDTO coldestDay;
    private ExtremePointDTO rainPeakHour;
    private ExtremePointDTO windPeakMoment;
    private ExtremePointDTO humidityMin;
    private ExtremePointDTO humidityMax;
}
