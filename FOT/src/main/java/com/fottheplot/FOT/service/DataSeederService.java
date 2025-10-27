package com.fottheplot.FOT.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fottheplot.FOT.dto.SeedDataDto;
import com.fottheplot.FOT.entity.MediaFile;
import com.fottheplot.FOT.entity.Movie;
import com.fottheplot.FOT.entity.TvShow;
import com.fottheplot.FOT.entity.Episode;
import com.fottheplot.FOT.repository.MovieRepository;
import com.fottheplot.FOT.repository.TvShowRepository;
import com.fottheplot.FOT.repository.MediaFileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DataSeederService {

    private static final Logger logger = LoggerFactory.getLogger(DataSeederService.class);

    private final MovieRepository movieRepository;
    private final TvShowRepository tvShowRepository;
    private final MediaFileRepository mediaFileRepository;
    private final ResourceLoader resourceLoader;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public DataSeederService(MovieRepository movieRepository, TvShowRepository tvShowRepository, MediaFileRepository mediaFileRepository, ResourceLoader resourceLoader) {
        this.movieRepository = movieRepository;
        this.tvShowRepository = tvShowRepository;
        this.mediaFileRepository = mediaFileRepository;
        this.resourceLoader = resourceLoader;
    }

    public void seedData() {
        if (movieRepository.count() > 0 || tvShowRepository.count() > 0) {
            logger.info("Database already seeded. Skipping data seeding.");
            return;
        }

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        DateTimeFormatter yearFormatter = DateTimeFormatter.ofPattern("yyyy");

        try {
            Resource resource = resourceLoader.getResource("classpath:data.json");
            SeedDataDto seedData;
            try (InputStream inputStream = resource.getInputStream()) {
                seedData = objectMapper.readValue(inputStream, SeedDataDto.class);
            }

            // Get all media files from the media directory
            List<String> mediaFiles = Files.list(Paths.get(uploadDir))
                    .filter(Files::isRegularFile)
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .filter(name -> name.endsWith(".webm"))
                    .collect(Collectors.toList());

            int movieMediaFileIndex = 0;
            int episodeMediaFileIndex = 7; // Start after movie media files

            // Seed Movies
            for (SeedDataDto.SeedMovieDto seedMovieDto : seedData.getMovies()) {
                Movie movie = new Movie();
                movie.setTitle(seedMovieDto.getTitle());
                movie.setDescription(seedMovieDto.getDescription());
                                    movie.setReleaseDate(LocalDate.parse(seedMovieDto.getRelease_date() + "-01-01", DateTimeFormatter.ISO_LOCAL_DATE));                movie.setDurationSeconds(parseDuration(seedMovieDto.getDuration()));
                movie.setGenre(String.join(",", seedMovieDto.getGenre()));
                movie.setPosterPath(seedMovieDto.getDisplay_pic());

                if (movieMediaFileIndex < mediaFiles.size()) {
                    String fileName = mediaFiles.get(movieMediaFileIndex);
                    MediaFile mediaFile = new MediaFile();
                    mediaFile.setFilename(fileName);
                                            mediaFile.setContentType("video/webm"); // Assuming all are webm
                                            mediaFile.setSize(0L); // Size will be updated by FileStorageService if needed
                                            movie.setMediaFile(mediaFile);                    movieMediaFileIndex++;
                } else {
                    logger.warn("Not enough media files for all movies. Movie: {}", movie.getTitle());
                }
                movieRepository.save(movie);
            }

            // Seed TV Shows and Episodes
            for (SeedDataDto.SeedTvShowDto seedTvShowDto : seedData.getTv_shows()) {
                TvShow tvShow = new TvShow();
                tvShow.setTitle(seedTvShowDto.getTitle());
                tvShow.setDescription(seedTvShowDto.getDescription());
                tvShow.setReleaseDate(LocalDate.parse(seedTvShowDto.getRelease_date() + "-01-01", DateTimeFormatter.ISO_LOCAL_DATE));
                tvShow.setGenre(String.join(",", seedTvShowDto.getGenre()));
                tvShow.setPosterPath(seedTvShowDto.getDisplay_pic());

                tvShowRepository.save(tvShow); // Save TvShow first to get an ID

                // Initialize episodes list if null
                if (tvShow.getEpisodes() == null) {
                    tvShow.setEpisodes(new ArrayList<>());
                }

                // For each episode URL, create an Episode entity
                for (int i = 0; i < seedTvShowDto.getEpisodes().size(); i++) {
                    // String episodeUrl = seedTvShowDto.getEpisodes().get(i); // Not used for media file assignment
                    Episode episode = new Episode();
                    episode.setTitle(tvShow.getTitle() + " Episode " + (i + 1)); // Simple naming
                    episode.setEpisodeNumber(i + 1);
                    episode.setTvShow(tvShow);

                    if (episodeMediaFileIndex < mediaFiles.size()) {
                        String fileName = mediaFiles.get(episodeMediaFileIndex);
                        MediaFile mediaFile = new MediaFile();
                        mediaFile.setFilename(fileName);
                        mediaFile.setContentType("video/webm");
                        mediaFile.setSize(0L);
                        episode.setMediaFile(mediaFile);
                        episodeMediaFileIndex++;
                    } else {
                        logger.warn("Not enough media files for all episodes. TV Show: {}, Episode: {}", tvShow.getTitle(), episode.getTitle());
                    }
                    tvShow.getEpisodes().add(episode);
                }
                tvShowRepository.save(tvShow); // Save again to persist episodes and their association
            }

            logger.info("Data seeding completed.");

        } catch (IOException e) {
            logger.error("Error seeding data from data.json", e);
        }
    }

    private Integer parseDuration(String duration) {
        if (duration == null || duration.isEmpty()) {
            return 0;
        }
        int totalSeconds = 0;
        String[] parts = duration.split(" ");
        for (String part : parts) {
            if (part.endsWith("h")) {
                totalSeconds += Integer.parseInt(part.replace("h", "")) * 3600;
            } else if (part.endsWith("m")) {
                totalSeconds += Integer.parseInt(part.replace("m", "")) * 60;
            }
        }
        return totalSeconds;
    }
}