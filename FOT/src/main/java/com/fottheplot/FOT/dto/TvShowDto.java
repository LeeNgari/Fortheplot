package com.fottheplot.FOT.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TvShowDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate releaseDate;
    private String genre;
    private String posterPath;
    private List<EpisodeDto> episodes;
}