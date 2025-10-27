package com.fottheplot.FOT.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "episodes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Episode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 1000)
    private String description;
    private Integer episodeNumber;
    private Integer durationSeconds;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tv_show_id")
    private TvShow tvShow;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "media_file_id", referencedColumnName = "id")
    private MediaFile mediaFile;

}