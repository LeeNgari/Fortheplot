package com.fottheplot.FOT.repository;

import com.fottheplot.FOT.entity.Episode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EpisodeRepository extends JpaRepository<Episode, Long> {
}