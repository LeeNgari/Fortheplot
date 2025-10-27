package com.fottheplot.FOT.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tv_shows")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TvShow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 1000)
    private String description;
    private LocalDate releaseDate;
    private String genre;
    private String posterPath;

    @OneToMany(mappedBy = "tvShow", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Episode> episodes;
}