package com.fottheplot.FOT.controller;

import com.fottheplot.FOT.entity.Comment;
import com.fottheplot.FOT.entity.User;
import com.fottheplot.FOT.repository.CommentRepository;
import com.fottheplot.FOT.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final RoomService roomService; // Using RoomService to find user for now

    public CommentController(CommentRepository commentRepository, RoomService roomService) {
        this.commentRepository = commentRepository;
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = roomService.findUserByUsername(username);

        comment.setUserId(user.getId());
        comment.setUsername(user.getUsername());
        
        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.ok(savedComment);
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Comment>> getMovieComments(@PathVariable Long movieId) {
        return ResponseEntity.ok(commentRepository.findByMovieIdOrderByCreatedAtDesc(movieId));
    }

    @GetMapping("/tvshow/{tvShowId}")
    public ResponseEntity<List<Comment>> getTvShowComments(@PathVariable Long tvShowId) {
        return ResponseEntity.ok(commentRepository.findByTvShowIdOrderByCreatedAtDesc(tvShowId));
    }
}
