package com.fottheplot.FOT.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "movies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 1000)
    private String description;
    private LocalDate releaseDate;
    private Integer durationSeconds;
    private String genre;
    private String posterPath;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "media_file_id", referencedColumnName = "id")
    private MediaFile mediaFile;
}