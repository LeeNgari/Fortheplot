package com.fottheplot.FOT.controller;

import com.fottheplot.FOT.dto.ApiResponse;
import com.fottheplot.FOT.dto.JwtAuthResponse;
import com.fottheplot.FOT.dto.LoginDto;
import com.fottheplot.FOT.dto.RegisterDto;
import com.fottheplot.FOT.service.AuthService;
import com.fottheplot.FOT.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, AuthService authService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> authenticateUser(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtil.generateToken((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());

        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(jwtUtil.getExpiration().intValue());
        response.addCookie(cookie);

        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(new JwtAuthResponse(token, roles)));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> registerUser(@RequestBody RegisterDto registerDto) {
        try {
            authService.registerUser(registerDto);
            return ResponseEntity.ok(ApiResponse.success("User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
        }
    }
}
