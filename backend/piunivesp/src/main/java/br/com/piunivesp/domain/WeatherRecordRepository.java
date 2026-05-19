package br.com.piunivesp.domain;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface WeatherRecordRepository extends JpaRepository<WeatherRecord, Long> {

    @Query(value = """
      SELECT
        AVG(temperature_c)        AS temperatureAvg,
        MIN(temperature_c)        AS temperatureMin,
        MAX(temperature_c)        AS temperatureMax,
        SUM(precipitation_mm_tot) AS precipitationSum,
        AVG(humidity_pct)         AS humidityAvg,
        AVG(wind_speed_ms)        AS windSpeedAvg,
        MAX(wind_speed_ms)        AS windSpeedMax
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      """, nativeQuery = true)
    Map<String, Object> aggregateDashboard(@Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end);

    @Query(value = """
      SELECT
        DATE_FORMAT(data_hora, '%Y-%m-%d 00:00:00') AS period,
        MIN(temperature_c) AS temperatureMin,
        AVG(temperature_c) AS temperatureAvg,
        MAX(temperature_c) AS temperatureMax
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      GROUP BY DATE_FORMAT(data_hora, '%Y-%m-%d')
      ORDER BY period
      """, nativeQuery = true)
    List<Map<String, Object>> aggregateTemperatureRangeDaily(@Param("start") LocalDateTime start,
                                                             @Param("end") LocalDateTime end);

    @Query(value = """
      SELECT
        DATE_FORMAT(data_hora, '%Y-%m-%d 00:00:00') AS period,
        AVG(temperature_c) AS value
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      GROUP BY DATE_FORMAT(data_hora, '%Y-%m-%d')
      ORDER BY value DESC
      LIMIT 1
      """, nativeQuery = true)
    Map<String, Object> hottestDay(@Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);

    @Query(value = """
      SELECT
        DATE_FORMAT(data_hora, '%Y-%m-%d 00:00:00') AS period,
        AVG(temperature_c) AS value
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      GROUP BY DATE_FORMAT(data_hora, '%Y-%m-%d')
      ORDER BY value ASC
      LIMIT 1
      """, nativeQuery = true)
    Map<String, Object> coldestDay(@Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);

    @Query(value = """
      SELECT
        DATE_FORMAT(data_hora, '%Y-%m-%d %H:00:00') AS period,
        SUM(precipitation_mm_tot) AS value
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      GROUP BY DATE_FORMAT(data_hora, '%Y-%m-%d %H:00:00')
      ORDER BY value DESC
      LIMIT 1
      """, nativeQuery = true)
    Map<String, Object> rainPeakHour(@Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);

    @Query(value = """
      SELECT
        DATE_FORMAT(data_hora, '%Y-%m-%d %H:%i:%s') AS period,
        wind_speed_ms AS value
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      ORDER BY wind_speed_ms DESC
      LIMIT 1
      """, nativeQuery = true)
    Map<String, Object> windPeakMoment(@Param("start") LocalDateTime start,
                                       @Param("end") LocalDateTime end);

    @Query(value = """
      SELECT
        DATE_FORMAT(data_hora, '%Y-%m-%d %H:%i:%s') AS period,
        humidity_pct AS value
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      ORDER BY humidity_pct ASC
      LIMIT 1
      """, nativeQuery = true)
    Map<String, Object> humidityMin(@Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);

    @Query(value = """
      SELECT
        DATE_FORMAT(data_hora, '%Y-%m-%d %H:%i:%s') AS period,
        humidity_pct AS value
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      ORDER BY humidity_pct DESC
      LIMIT 1
      """, nativeQuery = true)
    Map<String, Object> humidityMax(@Param("start") LocalDateTime start,
                                    @Param("end") LocalDateTime end);

    @Query(value = """
      SELECT
        DATE_FORMAT(data_hora, '%Y-%m-%d %H:00:00') AS period,
        AVG(solar_rad_wm2)     AS solarRadiationAvg,
        SUM(solar_flux_kj_tot) AS solarEnergySum
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      GROUP BY DATE_FORMAT(data_hora, '%Y-%m-%d %H:00:00')
      ORDER BY period
      """, nativeQuery = true)
    List<Map<String, Object>> aggregateSolarHourly(@Param("start") LocalDateTime start,
                                                   @Param("end") LocalDateTime end);

    @Query(value = """
      SELECT
        DATE_FORMAT(data_hora, '%Y-%m-%d 00:00:00') AS period,
        AVG(solar_rad_wm2)     AS solarRadiationAvg,
        SUM(solar_flux_kj_tot) AS solarEnergySum
      FROM weather_record
      WHERE data_hora BETWEEN :start AND :end
      GROUP BY DATE_FORMAT(data_hora, '%Y-%m-%d')
      ORDER BY period
      """, nativeQuery = true)
    List<Map<String, Object>> aggregateSolarDaily(@Param("start") LocalDateTime start,
                                                  @Param("end") LocalDateTime end);

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
