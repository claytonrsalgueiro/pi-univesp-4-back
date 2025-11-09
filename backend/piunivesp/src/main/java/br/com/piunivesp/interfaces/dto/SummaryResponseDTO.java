package br.com.piunivesp.interfaces.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SummaryResponseDTO {
    private String granularity;
    private List<SummaryPointDTO> points;
}
