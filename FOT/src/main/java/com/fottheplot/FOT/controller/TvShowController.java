package com.fottheplot.FOT.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fottheplot.FOT.dto.ApiResponse;
import com.fottheplot.FOT.dto.TvShowDto;
import com.fottheplot.FOT.entity.TvShow;
import com.fottheplot.FOT.service.TvShowService;
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
@RequestMapping("/api/tvshows")
public class TvShowController {

    private static final Logger logger = LoggerFactory.getLogger(TvShowController.class);

    private final TvShowService tvShowService;
    private final ObjectMapper objectMapper;

    public TvShowController(TvShowService tvShowService, ObjectMapper objectMapper) {
        this.tvShowService = tvShowService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<TvShow>> createTvShow(@RequestParam("metadata") String metadata, @RequestParam("files") List<MultipartFile> files) throws IOException {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to create a new TV show");
        TvShowDto tvShowDto = objectMapper.readValue(metadata, TvShowDto.class);
        TvShow tvShow = tvShowService.createTvShow(tvShowDto, files);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to create a new TV show in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(tvShow));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TvShow>>> getTvShows(@RequestParam(required = false) String title, @RequestParam(required = false) String genre, Pageable pageable) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get TV shows");
        Page<TvShow> tvShows = tvShowService.getTvShows(title, genre, pageable);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get TV shows in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(tvShows));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TvShow>> getTvShowById(@PathVariable Long id) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get TV show with id {}", id);
        TvShow tvShow = tvShowService.getTvShowById(id);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get TV show with id {} in {} ms", id, timeTaken);
        return ResponseEntity.ok(ApiResponse.success(tvShow));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTvShow(@PathVariable Long id) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to delete TV show with id {}", id);
        tvShowService.deleteTvShow(id);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to delete TV show with id {} in {} ms", id, timeTaken);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<TvShow>> updateTvShow(@PathVariable Long id, @RequestBody TvShowDto tvShowDto) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to update TV show with id {}", id);
        TvShow tvShow = tvShowService.updateTvShow(id, tvShowDto);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to update TV show with id {} in {} ms", id, timeTaken);
        return ResponseEntity.ok(ApiResponse.success(tvShow));
    }
}
