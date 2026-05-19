package br.com.piunivesp.interfaces.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolarRadiationPointDTO {
    private LocalDateTime period;
    private Double solarRadiationAvg;
    private Double solarEnergySum;
}
