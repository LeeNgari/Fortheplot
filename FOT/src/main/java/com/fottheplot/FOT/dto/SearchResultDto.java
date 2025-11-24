package com.fottheplot.FOT.dto;

import com.fottheplot.FOT.dto.TvShowDto;
import com.fottheplot.FOT.entity.Movie;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResultDto {
    private List<Movie> movies;
    private List<TvShowDto> tvShows;
}
