package br.com.piunivesp.interfaces.dto;


import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChartSeriesDTO {
    private String granularity;
    private List<SummaryPointDTO> data;
}
