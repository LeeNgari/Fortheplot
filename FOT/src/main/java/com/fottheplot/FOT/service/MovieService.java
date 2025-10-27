package com.fottheplot.FOT.service;

import com.fottheplot.FOT.dto.MovieDto;
import com.fottheplot.FOT.entity.MediaFile;
import com.fottheplot.FOT.entity.Movie;
import com.fottheplot.FOT.repository.MovieRepository;
import com.fottheplot.FOT.repository.MovieSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class MovieService {

    private static final Logger logger = LoggerFactory.getLogger(MovieService.class);

    private final MovieRepository movieRepository;
    private final FileStorageService fileStorageService;

    public MovieService(MovieRepository movieRepository, FileStorageService fileStorageService) {
        this.movieRepository = movieRepository;
        this.fileStorageService = fileStorageService;
    }

    public Movie createMovie(MovieDto movieDto, MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);

            MediaFile mediaFile = new MediaFile();
            mediaFile.setFilename(fileName);
            mediaFile.setContentType(file.getContentType());
            mediaFile.setSize(file.getSize());

            Movie movie = new Movie();
            movie.setTitle(movieDto.getTitle());
            movie.setDescription(movieDto.getDescription());
            movie.setReleaseDate(movieDto.getReleaseDate());
            movie.setDurationSeconds(movieDto.getDurationSeconds());
            movie.setGenre(movieDto.getGenre());
            movie.setPosterPath(movieDto.getPosterPath());
            movie.setMediaFile(mediaFile);

            return movieRepository.save(movie);
        } catch (Exception e) {
            logger.error("Error creating movie", e);
            throw new RuntimeException("Error creating movie");
        }
    }

    public Page<Movie> getMovies(String title, String genre, Pageable pageable) {
        Specification<Movie> spec = Specification.where(MovieSpecification.titleContains(title))
                .and(MovieSpecification.genreEquals(genre));
        return movieRepository.findAll(spec, pageable);
    }

    public List<Movie> getRandomMovies() {
        return movieRepository.findRandomMovies();
    }

    public List<Movie> getRecentMovies() {
        return movieRepository.findTop5ByOrderByReleaseDateDesc();
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id).orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public void deleteMovie(Long id) {
        try {
            movieRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Error deleting movie with id {}", id, e);
            throw new RuntimeException("Error deleting movie");
        }
    }

    public Movie updateMovie(Long id, MovieDto movieDto) {
        try {
            Movie movie = getMovieById(id);
            movie.setTitle(movieDto.getTitle());
            movie.setDescription(movieDto.getDescription());
            movie.setReleaseDate(movieDto.getReleaseDate());
            movie.setDurationSeconds(movieDto.getDurationSeconds());
            movie.setGenre(movieDto.getGenre());
            movie.setPosterPath(movieDto.getPosterPath());
            return movieRepository.save(movie);
        } catch (Exception e) {
            logger.error("Error updating movie with id {}", id, e);
            throw new RuntimeException("Error updating movie");
        }
    }
}