package com.fottheplot.FOT.service;

import com.fottheplot.FOT.dto.RoomDto;
import com.fottheplot.FOT.entity.Movie;
import com.fottheplot.FOT.entity.PlaybackState;

import com.fottheplot.FOT.entity.Room;
import com.fottheplot.FOT.entity.User;
import com.fottheplot.FOT.repository.MovieRepository;
import com.fottheplot.FOT.repository.RoomRepository;
import com.fottheplot.FOT.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    private static final Logger logger = LoggerFactory.getLogger(RoomService.class);

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final PasswordEncoder passwordEncoder;

    public RoomService(RoomRepository roomRepository, UserRepository userRepository, MovieRepository movieRepository, PasswordEncoder passwordEncoder) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Room createRoom(RoomDto roomDto) {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));

            Movie movie = null;
            if (roomDto.getMovieId() != null) {
                movie = movieRepository.findById(roomDto.getMovieId()).orElse(null);
            }

            Room room = new Room();
            room.setName(roomDto.getName());
            room.setPublic(roomDto.isPublic());
            if (!roomDto.isPublic() && roomDto.getPassword() != null) {
                room.setPassword(passwordEncoder.encode(roomDto.getPassword()));
            }
            room.setHost(user);
            room.setMovie(movie);

            PlaybackState playbackState = new PlaybackState();
            playbackState.setPlaying(false);
            playbackState.setPosition(0);
            playbackState.setLastUpdated(System.currentTimeMillis());
            room.setPlaybackState(playbackState);

            return roomRepository.save(room);
        } catch (Exception e) {
            logger.error("Error creating room", e);
            throw new RuntimeException("Error creating room");
        }
    }

    public Page<Room> getPublicRooms(Pageable pageable) {
        return roomRepository.findAll(pageable);
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }
}
