package com.fottheplot.FOT.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private boolean isPublic;
    private String password;

    @ManyToOne
    @JoinColumn(name = "host_id")
    private User host;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "playback_state_id", referencedColumnName = "id")
    private PlaybackState playbackState;
}