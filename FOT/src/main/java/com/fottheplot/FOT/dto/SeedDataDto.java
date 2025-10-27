package com.fottheplot.FOT.dto;

import lombok.Data;

import java.util.List;

@Data
public class SeedDataDto {
    private List<SeedMovieDto> movies;
    private List<SeedTvShowDto> tv_shows;

    @Data
    public static class SeedMovieDto {
        private String title;
        private String description;
        private String duration;
        private String release_date;
        private List<String> genre;
        private String movie_url;
        private String display_pic;
    }

    @Data
    public static class SeedTvShowDto {
        private String title;
        private String description;
        private String duration; // This seems to be for episodes, not the show itself
        private String release_date;
        private List<String> genre;
        private String display_pic;
        private List<String> episodes; // URLs for episodes
    }
}
