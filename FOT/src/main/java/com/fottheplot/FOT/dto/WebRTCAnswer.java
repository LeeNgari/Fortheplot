package com.fottheplot.FOT.dto;

import lombok.Data;

@Data
public class WebRTCAnswer {
    private String sdp;
    private Long targetParticipantId;
}