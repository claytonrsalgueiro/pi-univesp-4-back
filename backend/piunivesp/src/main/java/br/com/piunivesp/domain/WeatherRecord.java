package br.com.piunivesp.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "weather_record",
        indexes = {@Index(name = "idx_weather_ts", columnList = "data_hora")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "record_no")
    private Integer recordNo;

    @Column(name = "wind_speed_ms")
    private Double windSpeedMs;        // VelVent_ms

    @Column(name = "wind_dir_deg")
    private Double windDirDeg;         // DirVent

    @Column(name = "solar_rad_wm2")
    private Double solarRadWm2;        // RadW

    @Column(name = "solar_flux_kj_tot")
    private Double solarFluxKJTot;     // RadFlukJ_Tot

    @Column(name = "temperature_c")
    private Double temperatureC;       // Temp

    @Column(name = "humidity_pct")
    private Double humidityPct;        // UR

    @Column(name = "pressure_mbar")
    private Double pressureMbar;       // Press_mbar

    @Column(name = "precipitation_mm_tot")
    private Double precipitationMmTot; // Chuva_mm_Tot
}
