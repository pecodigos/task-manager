package com.pecodigos.task_manager.security;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)

                // Permit access to static resources and login/register pages
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/login.html", "/register.html", "/css/**", "/js/**").permitAll()
                        .anyRequest().authenticated() // Protect other pages
                )

                // Configure form-based login
                .formLogin(formLogin -> formLogin
                        .loginPage("/login.html")
                        .loginProcessingUrl("/user/login")
                        .defaultSuccessUrl("/projects.html", true) // Redirect to projects.html after login
                        .permitAll()
                )

                // Handle logout
                .logout(logout -> logout
                        .logoutUrl("/user/logout")
                        .logoutSuccessUrl("/login.html")
                        .permitAll()
                )

                // Session management: session created after login
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Create session only when needed
                )

                // Remember where the user wanted to go before login
                .requestCache(requestCache -> requestCache
                        .requestCache(new HttpSessionRequestCache())
                );

        return http.build();
    }
}
