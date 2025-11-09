package br.com.piunivesp.interfaces.dto;


import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class UploadResponseDTO {
    private long rowsIngested;
    private String message;
}

