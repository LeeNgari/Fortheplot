package com.fottheplot.FOT.dto;

import lombok.Data;

@Data
public class RoomDto {
    private String name;
    private boolean isPublic;
    private String password;
    private Long movieId;
}