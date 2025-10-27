package com.fottheplot.FOT.repository;

import com.fottheplot.FOT.entity.MediaFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {
}