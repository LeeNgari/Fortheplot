package com.fottheplot.FOT.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JwtAuthResponse {
    private String token;
    private List<String> roles;
}