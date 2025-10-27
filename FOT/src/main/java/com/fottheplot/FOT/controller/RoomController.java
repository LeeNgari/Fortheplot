package com.fottheplot.FOT.controller;

import com.fottheplot.FOT.dto.ApiResponse;
import com.fottheplot.FOT.dto.RoomDto;
import com.fottheplot.FOT.entity.Room;
import com.fottheplot.FOT.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private static final Logger logger = LoggerFactory.getLogger(RoomController.class);

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Room>> createRoom(@RequestBody RoomDto roomDto) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to create a new room");
        Room room = roomService.createRoom(roomDto);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to create a new room in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(room));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Room>>> getPublicRooms(Pageable pageable) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get public rooms");
        Page<Room> rooms = roomService.getPublicRooms(pageable);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get public rooms in {} ms", timeTaken);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Room>> getRoomById(@PathVariable Long id) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to get room with id {}", id);
        Room room = roomService.getRoomById(id);
        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to get room with id {} in {} ms", id, timeTaken);
        return ResponseEntity.ok(ApiResponse.success(room));
    }
}
