package com.fottheplot.FOT.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaybackState {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private boolean playing;
    private double position;
    private long lastUpdated;

    @OneToOne(mappedBy = "playbackState")
    private Room room;
}