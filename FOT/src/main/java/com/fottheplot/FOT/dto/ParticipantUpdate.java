package com.fottheplot.FOT.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantUpdate {
    private List<Participant> participants;
    private String type; // JOIN, LEAVE, UPDATE
    private Participant participant;
}
