package com.fottheplot.FOT.dto;

import lombok.Data;

@Data
public class MediaFileDto {
    private Long id;
    private String filename;
    private String contentType;
    private Long size;
}