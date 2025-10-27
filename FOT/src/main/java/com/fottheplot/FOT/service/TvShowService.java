package com.fottheplot.FOT.service;

import com.fottheplot.FOT.dto.EpisodeDto;
import com.fottheplot.FOT.dto.TvShowDto;
import com.fottheplot.FOT.entity.Episode;
import com.fottheplot.FOT.entity.MediaFile;
import com.fottheplot.FOT.entity.TvShow;
import com.fottheplot.FOT.repository.EpisodeRepository;
import com.fottheplot.FOT.repository.TvShowRepository;
import com.fottheplot.FOT.repository.TvShowSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class TvShowService {

    private static final Logger logger = LoggerFactory.getLogger(TvShowService.class);

    private final TvShowRepository tvShowRepository;
    private final EpisodeRepository episodeRepository;
    private final FileStorageService fileStorageService;

    public TvShowService(TvShowRepository tvShowRepository, EpisodeRepository episodeRepository, FileStorageService fileStorageService) {
        this.tvShowRepository = tvShowRepository;
        this.episodeRepository = episodeRepository;
        this.fileStorageService = fileStorageService;
    }

    public TvShow createTvShow(TvShowDto tvShowDto, List<MultipartFile> episodeFiles) {
        try {
            TvShow tvShow = new TvShow();
            tvShow.setTitle(tvShowDto.getTitle());
            tvShow.setDescription(tvShowDto.getDescription());
            tvShow.setReleaseDate(tvShowDto.getReleaseDate());
            tvShow.setGenre(tvShowDto.getGenre());
            tvShow.setPosterPath(tvShowDto.getPosterPath());

            List<Episode> episodes = new ArrayList<>();
            for (int i = 0; i < tvShowDto.getEpisodes().size(); i++) {
                EpisodeDto episodeDto = tvShowDto.getEpisodes().get(i);
                MultipartFile file = episodeFiles.get(i);

                String fileName = fileStorageService.storeFile(file);

                MediaFile mediaFile = new MediaFile();
                mediaFile.setFilename(fileName);
                mediaFile.setContentType(file.getContentType());
                mediaFile.setSize(file.getSize());

                Episode episode = new Episode();
                episode.setTitle(episodeDto.getTitle());
                episode.setEpisodeNumber(episodeDto.getEpisodeNumber());
                episode.setDurationSeconds(episodeDto.getDurationSeconds());
                episode.setTvShow(tvShow);
                episode.setMediaFile(mediaFile);
                episodes.add(episode);
            }
            tvShow.setEpisodes(episodes);

            return tvShowRepository.save(tvShow);
        } catch (Exception e) {
            logger.error("Error creating TV show", e);
            throw new RuntimeException("Error creating TV show");
        }
    }

    public Page<TvShow> getTvShows(String title, String genre, Pageable pageable) {
        Specification<TvShow> spec = Specification.where(TvShowSpecification.titleContains(title))
                .and(TvShowSpecification.genreEquals(genre));
        return tvShowRepository.findAll(spec, pageable);
    }

    public TvShow getTvShowById(Long id) {
        return tvShowRepository.findById(id).orElseThrow(() -> new RuntimeException("TV Show not found"));
    }

    public void deleteTvShow(Long id) {
        try {
            tvShowRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Error deleting TV show with id {}", id, e);
            throw new RuntimeException("Error deleting TV show");
        }
    }

    public TvShow updateTvShow(Long id, TvShowDto tvShowDto) {
        try {
            TvShow tvShow = getTvShowById(id);
            tvShow.setTitle(tvShowDto.getTitle());
            tvShow.setDescription(tvShowDto.getDescription());
            tvShow.setReleaseDate(tvShowDto.getReleaseDate());
            tvShow.setGenre(tvShowDto.getGenre());
            tvShow.setPosterPath(tvShowDto.getPosterPath());

            // TODO: Handle episode updates

            return tvShowRepository.save(tvShow);
        } catch (Exception e) {
            logger.error("Error updating TV show with id {}", id, e);
            throw new RuntimeException("Error updating TV show");
        }
    }
}
