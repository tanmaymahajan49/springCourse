package com.user.filter;

import javax.crypto.SecretKey;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthFilter implements GlobalFilter {

	private final String SECRET_KEY = "zxcvbnm123asdfghjkl456qwertyuiop789qwertyuiop";
	private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
		ServerHttpRequest request = exchange.getRequest();

		if (request.getURI().getPath().contains("/login") || request.getURI().getPath().contains("-register")) {
			return chain.filter(exchange);
		}

		String token = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
		if (token == null || !token.startsWith("Bearer ")) {
			return onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
		}

		String jwt = token.substring(7);
		Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(jwt).getPayload();

		String role = claims.get("role", String.class);
		String path = request.getURI().getPath();

		if (!isAuthorized(path, role)) {
			return onError(exchange, "Not authorized", HttpStatus.FORBIDDEN);
		}

		return chain.filter(exchange);
	}

	private boolean isAuthorized(String path, String role) {
		if (path.startsWith("/farmer") && role.equals("FARMER"))
			return true;
		if (path.startsWith("/dealer") && role.equals("DEALER"))
			return true;
		if (path.startsWith("/admin") && role.equals("ADMIN"))
			return true;
		return false;
	}

	private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus status) {
		ServerHttpResponse response = exchange.getResponse();
		response.setStatusCode(status);
		return response.setComplete();
	}

}
