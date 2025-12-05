package com.fottheplot.FOT.repository;

import com.fottheplot.FOT.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByMovieIdOrderByCreatedAtDesc(Long movieId);
    List<Comment> findByTvShowIdOrderByCreatedAtDesc(Long tvShowId);
}
