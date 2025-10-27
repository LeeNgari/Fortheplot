package com.fottheplot.FOT.dto;

import lombok.Data;

@Data
public class WebRTCOffer {
    private String sdp;
    private Long targetParticipantId;
}