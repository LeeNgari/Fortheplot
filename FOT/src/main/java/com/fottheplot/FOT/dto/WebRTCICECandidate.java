package com.fottheplot.FOT.dto;

import lombok.Data;

@Data
public class WebRTCICECandidate {
    private String sdpMid;
    private Integer sdpMLineIndex;
    private String sdpCandidate;
    private Long targetParticipantId;
}