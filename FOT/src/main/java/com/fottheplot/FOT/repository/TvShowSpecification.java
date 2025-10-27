package com.fottheplot.FOT.repository;

import com.fottheplot.FOT.entity.TvShow;
import org.springframework.data.jpa.domain.Specification;

public class TvShowSpecification {

    public static Specification<TvShow> titleContains(String title) {
        return (root, query, criteriaBuilder) ->
                title == null ? criteriaBuilder.conjunction() : criteriaBuilder.like(criteriaBuilder.lower(root.get("title")),
                        "%" + title.toLowerCase() + "%");
    }

    public static Specification<TvShow> genreEquals(String genre) {
        return (root, query, criteriaBuilder) ->
                genre == null ? criteriaBuilder.conjunction() : criteriaBuilder.equal(criteriaBuilder.lower(root.get("genre")),
                        genre.toLowerCase());
    }
}
