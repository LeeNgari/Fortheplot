package com.fottheplot.FOT.repository;

import com.fottheplot.FOT.entity.TvShow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TvShowRepository extends JpaRepository<TvShow, Long>, JpaSpecificationExecutor<TvShow> {
}