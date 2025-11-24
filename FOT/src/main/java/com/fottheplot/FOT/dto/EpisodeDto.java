package com.fottheplot.FOT.dto;

import lombok.Data;

@Data
public class EpisodeDto {
    private String title;
    private Integer episodeNumber;
    private Integer durationSeconds;
    private MediaFileDto mediaFile;
}