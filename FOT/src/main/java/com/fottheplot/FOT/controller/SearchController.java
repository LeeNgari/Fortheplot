package com.fottheplot.FOT.controller;

import com.fottheplot.FOT.dto.ApiResponse;
import com.fottheplot.FOT.dto.SearchResultDto;
import com.fottheplot.FOT.entity.Movie;
import com.fottheplot.FOT.entity.TvShow;
import com.fottheplot.FOT.service.MovieService;
import com.fottheplot.FOT.service.TvShowService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private static final Logger logger = LoggerFactory.getLogger(SearchController.class);

    private final MovieService movieService;
    private final TvShowService tvShowService;

    public SearchController(MovieService movieService, TvShowService tvShowService) {
        this.movieService = movieService;
        this.tvShowService = tvShowService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SearchResultDto>> search(@RequestParam String query, Pageable pageable) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to search with query: {}", query);

        Page<Movie> movies = movieService.getMovies(query, null, pageable);
        Page<TvShow> tvShows = tvShowService.getTvShows(query, null, pageable);

        SearchResultDto searchResult = new SearchResultDto(movies.getContent(), tvShows.getContent());

        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to search with query: {} in {} ms", query, timeTaken);

        return ResponseEntity.ok(ApiResponse.success(searchResult));
    }
}
