package com.fottheplot.FOT.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private int statusCode;
    private T data;
    private String error;
    private long timestamp;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, data, null, System.currentTimeMillis());
    }

    public static <T> ApiResponse<T> error(int statusCode, String errorMessage) {
        return new ApiResponse<>(statusCode, null, errorMessage, System.currentTimeMillis());
    }
}
