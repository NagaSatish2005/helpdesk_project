package com.example.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.backend.security.JwtAuthenticationFilter;
import com.example.backend.security.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationProvider authenticationProvider) {
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/tickets")
                        .hasAnyRole("STUDENT", "STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tickets/*")
                        .hasAnyRole("STUDENT", "STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tickets")
                        .hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/tickets/user/*")
                        .hasAnyRole("STUDENT", "STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/tickets/*")
                        .hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/comments")
                        .hasAnyRole("STUDENT", "STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/comments/*")
                        .hasAnyRole("STUDENT", "STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/comments/ticket/*")
                        .hasAnyRole("STUDENT", "STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/dashboard/summary")
                        .hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users")
                        .hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/*")
                        .hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users/staff")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/users/*/status")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/users/*")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/*")
                        .hasRole("ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
