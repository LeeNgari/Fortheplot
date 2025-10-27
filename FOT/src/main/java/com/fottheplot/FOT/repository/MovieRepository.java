package com.fottheplot.FOT.repository;

import com.fottheplot.FOT.entity.Movie;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
    @Query(value = "SELECT * FROM movies ORDER BY RANDOM() LIMIT 5", nativeQuery = true)
    List<Movie> findRandomMovies();

    List<Movie> findTop5ByOrderByReleaseDateDesc();
}