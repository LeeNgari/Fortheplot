package com.fottheplot.FOT.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieDto {
    private String title;
    private String description;
    private LocalDate releaseDate;
    private Integer durationSeconds;
    private String genre;
    private String posterPath;
}