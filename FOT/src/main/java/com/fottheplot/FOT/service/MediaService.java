package com.fottheplot.FOT.service;

import com.fottheplot.FOT.entity.MediaFile;
import com.fottheplot.FOT.repository.MediaFileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class MediaService {

    private static final Logger logger = LoggerFactory.getLogger(MediaService.class);

    private final Path fileStorageLocation;
    private final MediaFileRepository mediaFileRepository;

    public MediaService(@Value("${file.upload-dir}") String uploadDir, MediaFileRepository mediaFileRepository) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.mediaFileRepository = mediaFileRepository;
    }

    public ResponseEntity<Resource> getMediaResource(Long mediaId, String range) {
        try {
            MediaFile mediaFile = getMediaFile(mediaId);
            Resource resource = loadFileAsResource(mediaFile.getFilename());
            long fileSize = resource.contentLength();

            if (range != null) {
                String[] ranges = range.substring("bytes=".length()).split("-");
                long rangeStart = Long.parseLong(ranges[0]);
                long rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;

                if (rangeStart > fileSize || rangeEnd > fileSize) {
                    return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).build();
                }

                long contentLength = rangeEnd - rangeStart + 1;

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(mediaFile.getContentType()));
                headers.setContentLength(contentLength);
                headers.set("Accept-Ranges", "bytes");
                headers.set("Content-Range", "bytes " + rangeStart + "-" + rangeEnd + "/" + fileSize);

                return new ResponseEntity<>(resource, headers, HttpStatus.PARTIAL_CONTENT);
            } else {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(mediaFile.getContentType()));
                headers.setContentLength(fileSize);

                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            }
        } catch (IOException e) {
            logger.error("Error streaming media file with id {}", mediaId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public MediaFile getMediaMetadata(Long mediaId) {
        return getMediaFile(mediaId);
    }

    private MediaFile getMediaFile(Long mediaId) {
        return mediaFileRepository.findById(mediaId)
                .orElseThrow(() -> new RuntimeException("Media file not found"));
    }

    private Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }
}
