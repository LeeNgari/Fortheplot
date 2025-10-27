package com.fottheplot.FOT.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fottheplot.FOT.dto.ApiResponse;
import com.fottheplot.FOT.dto.MovieDto;
import com.fottheplot.FOT.entity.Movie;
import com.fottheplot.FOT.service.MovieService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private static final Logger logger = LoggerFactory.getLogger(MovieController.class);

    private final MovieService movieService;
    private final ObjectMapper objectMapper;

    public MovieController(MovieService movieService, ObjectMapper objectMapper) {
        this.movieService = movieService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Movie>> createMovie(@RequestParam("metadata") String metadata, @RequestParam("file") MultipartFile file) throws IOException {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to create a new movie");
        MovieDto movieDto = objectMapper.readValue(metadata, MovieDto.class);
        Movie movie = movieService.createMovie(movieDto, file);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to create a new movie in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(movie));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Movie>>> getMovies(@RequestParam(required = false) String title, @RequestParam(required = false) String genre, Pageable pageable) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get movies with title: {} and genre: {}", title, genre);
        Page<Movie> movies = movieService.getMovies(title, genre, pageable);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get movies in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<Movie>>> getTrendingMovies() {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get trending movies");
        List<Movie> movies = movieService.getRandomMovies();
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get trending movies in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Movie>>> getFeaturedMovies() {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get featured movies");
        List<Movie> movies = movieService.getRandomMovies();
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get featured movies in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<Movie>>> getPopularMovies() {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get popular movies");
        List<Movie> movies = movieService.getRandomMovies();
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get popular movies in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<Movie>>> getRecentMovies() {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get recent movies");
        List<Movie> movies = movieService.getRecentMovies();
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get recent movies in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Movie>> getMovieById(@PathVariable Long id) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get movie with id {}", id);
        Movie movie = movieService.getMovieById(id);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get movie with id {} in {} ms", id, timeTaken);
        return ResponseEntity.ok(ApiResponse.success(movie));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long id) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to delete movie with id {}", id);
        movieService.deleteMovie(id);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to delete movie with id {} in {} ms", id, timeTaken);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Movie>> updateMovie(@PathVariable Long id, @RequestBody MovieDto movieDto) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to update movie with id {}", id);
        Movie movie = movieService.updateMovie(id, movieDto);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to update movie with id {} in {} ms", id, timeTaken);
        return ResponseEntity.ok(ApiResponse.success(movie));
    }
}
