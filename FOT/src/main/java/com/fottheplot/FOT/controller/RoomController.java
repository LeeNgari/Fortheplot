package com.fottheplot.FOT.controller;

import com.fottheplot.FOT.dto.ApiResponse;
import com.fottheplot.FOT.dto.RoomDto;
import com.fottheplot.FOT.dto.UpdateRoomMovieRequest;
import com.fottheplot.FOT.entity.Movie;
import com.fottheplot.FOT.entity.Room;
import com.fottheplot.FOT.service.MovieService;
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
    private final MovieService movieService;

    public RoomController(RoomService roomService, MovieService movieService) {
        this.roomService = roomService;
        this.movieService = movieService;
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

    @PutMapping("/{roomId}/movie")
    public ResponseEntity<ApiResponse<Room>> updateRoomMovie(@PathVariable Long roomId, @RequestBody UpdateRoomMovieRequest request) {
        long startTime = System.currentTimeMillis();
        logger.info("Received request to update room {} with movie {}", roomId, request.getMovieId());

        Room room = roomService.getRoomById(roomId);
        Movie movie = movieService.getMovieById(request.getMovieId());

        room.setMovie(movie);
        room = roomService.saveRoom(room);

        logger.info("Room after update: {}", room);
        if (room.getMovie() != null) {
            logger.info("Updated Room Movie: {}", room.getMovie().getTitle());
            if (room.getMovie().getMediaFile() != null) {
                logger.info("Updated Room Movie MediaFile filename: {}", room.getMovie().getMediaFile().getFilename());
            } else {
                logger.warn("Updated Room Movie MediaFile is null.");
            }
        } else {
            logger.warn("Updated Room Movie is null.");
        }

        long timeTaken = System.currentTimeMillis() - startTime;
        logger.info("Finished request to update room {} with movie {} in {} ms", roomId, request.getMovieId(), timeTaken);
        return ResponseEntity.ok(ApiResponse.success(room));
    }
}
