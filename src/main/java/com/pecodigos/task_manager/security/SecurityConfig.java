package com.pecodigos.task_manager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    public SecurityConfig(RetrieveUserService retrieveUserService) {
        this.userDetailsService = retrieveUserService;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Permit access to static resources and login/register pages
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/css/**", "/js/**", "/index.html", "/").permitAll()
                        .requestMatchers("/login.html", "/register.html").anonymous()
                        .anyRequest().authenticated()
                )

                // Configure form-based login
                .formLogin(formLogin -> formLogin
                        .loginPage("/login.html")
                        .loginProcessingUrl("/user/login")
                        .defaultSuccessUrl("/projects.html", true)
                )

                // Handle logout
                .logout(logout -> logout
                        .logoutUrl("/user/logout")
                        .logoutSuccessUrl("/index.html")
                        .permitAll()
                )

                .exceptionHandling(exception -> exception.accessDeniedHandler(((request, response, accessDeniedException) -> {
                    response.sendRedirect("/projects.html");
                })))

                .csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }
}
