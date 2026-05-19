package br.com.piunivesp.interfaces.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemperatureRangeChartDTO {
    private String granularity;
    private List<TemperatureRangePointDTO> data;
}
