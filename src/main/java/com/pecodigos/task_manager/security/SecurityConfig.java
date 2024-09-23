package com.pecodigos.task_manager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.requestMatchers("/static/**", "/css/**", "/js/**", "/register.html", "/user/login", "/user/register", "/user/logout").permitAll().anyRequest().authenticated())
                .formLogin(form -> form.loginPage("/login.html").defaultSuccessUrl("/projects.html", true).permitAll())
                .logout(logout -> logout.logoutUrl("/user/logout").logoutSuccessUrl("/login.html").permitAll())
                .csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }
}
