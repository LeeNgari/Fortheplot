package com.fottheplot.FOT.dto;

import lombok.Data;

@Data
public class ChatMessage {
    private String content;
    private String sender;
    private String type;
}