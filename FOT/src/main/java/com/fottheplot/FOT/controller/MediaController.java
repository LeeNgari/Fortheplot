package com.fottheplot.FOT.controller;

import com.fottheplot.FOT.dto.ApiResponse;
import com.fottheplot.FOT.entity.MediaFile;
import com.fottheplot.FOT.service.MediaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private static final Logger logger = LoggerFactory.getLogger(MediaController.class);

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @GetMapping("/{mediaId}")
    public ResponseEntity<Resource> streamMedia(@PathVariable Long mediaId, @RequestHeader(value = "Range", required = false) String range) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to stream media with id {}", mediaId);
        ResponseEntity<Resource> response = mediaService.getMediaResource(mediaId, range);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to stream media with id {} in {} ms", mediaId, timeTaken);
        return response;
    }

    @GetMapping("/{mediaId}/metadata")
    public ResponseEntity<ApiResponse<MediaFile>> getMediaMetadata(@PathVariable Long mediaId) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get media metadata with id {}", mediaId);
        MediaFile mediaFile = mediaService.getMediaMetadata(mediaId);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get media metadata with id {} in {} ms", mediaId, timeTaken);
        return ResponseEntity.ok(ApiResponse.success(mediaFile));
    }
}
