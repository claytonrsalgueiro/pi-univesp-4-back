package br.com.piunivesp.domain;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface WeatherRecordRepository extends JpaRepository<WeatherRecord, Long> {

    // Por HORA
    @Query(value = """
      SELECT 
        DATE_FORMAT(data_hora, '%Y-%m-%d %H:00:00') AS period,
        AVG(temperature_c)        AS temperatureAvg,
        AVG(wind_speed_ms)        AS windSpeedAvg,
        SUM(precipitation_mm_tot) AS precipitationSum,
        AVG(humidity_pct)         AS humidityAvg
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      GROUP BY DATE_FORMAT(data_hora, '%Y-%m-%d %H:00:00')   -- <<< igual ao SELECT
      ORDER BY period
      """, nativeQuery = true)
    List<Map<String, Object>> aggregateHourly(@Param("start") LocalDateTime start,
                                              @Param("end") LocalDateTime end);

    // Por DIA
    @Query(value = """
      SELECT 
        DATE_FORMAT(data_hora, '%Y-%m-%d 00:00:00') AS period,
        AVG(temperature_c)        AS temperatureAvg,
        AVG(wind_speed_ms)        AS windSpeedAvg,
        SUM(precipitation_mm_tot) AS precipitationSum,
        AVG(humidity_pct)         AS humidityAvg
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      GROUP BY DATE_FORMAT(data_hora, '%Y-%m-%d')            -- <<< mesma base do SELECT
      ORDER BY period
      """, nativeQuery = true)
    List<Map<String, Object>> aggregateDaily(@Param("start") LocalDateTime start,
                                             @Param("end") LocalDateTime end);
}
