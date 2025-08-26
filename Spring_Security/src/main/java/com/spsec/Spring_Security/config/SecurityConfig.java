package com.spsec.Spring_Security.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	private UserDetailsService userDetailsService;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.csrf(customizer -> customizer.disable()); // we disables the csrf
		http.authorizeHttpRequests(req -> req.anyRequest().authenticated()); // it is now authenicatred but form is not
																				// visible to achive that
		http.formLogin(Customizer.withDefaults()); // now form is visible and working but not in postman, when we run
													// the url it returns the login form code to achive that
		http.httpBasic(Customizer.withDefaults()); // this will work for postman
//		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); //on every refresh we will get new session ID

		return http.build();
	}
	
//	@Bean 
//	public UserDetailsService userDetailsService() {
//
//		
//		UserDetails user1 = User
//				.withDefaultPasswordEncoder()
//				.username("harsh")
//				.password("h@123")
//				.roles("USER")
//				.build();
//		
//		UserDetails user2 = User
//				.withDefaultPasswordEncoder()
//				.username("kiran")
//				.password("k@123")
//				.roles("ADMIN")
//				.build();
//		
//		return new InMemoryUserDetailsManager(user1, user2);
//	}
	
	
	@Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(NoOpPasswordEncoder.getInstance());
        provider.setUserDetailsService(userDetailsService);

        return provider;
    }

}
