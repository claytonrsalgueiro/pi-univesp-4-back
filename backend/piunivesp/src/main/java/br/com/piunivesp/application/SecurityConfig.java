package br.com.piunivesp.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private Environment env;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/weather/**").authenticated()
                        .anyRequest().permitAll()
                )
                .httpBasic(httpBasic -> {}); // ativa Basic Auth

        return http.build();
    }

    @Bean
    public UserDetailsService users(PasswordEncoder encoder) {
        String user = env.getProperty("auth.username", "admin");
        String pass = env.getProperty("auth.password", "123456");
        UserDetails u = User.builder()
                .username(user)
                .password(encoder.encode(pass))
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(u);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
