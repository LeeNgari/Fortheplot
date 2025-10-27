package com.fottheplot.FOT.dto;

import com.fottheplot.FOT.entity.Movie;
import com.fottheplot.FOT.entity.TvShow;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResultDto {
    private List<Movie> movies;
    private List<TvShow> tvShows;
}
