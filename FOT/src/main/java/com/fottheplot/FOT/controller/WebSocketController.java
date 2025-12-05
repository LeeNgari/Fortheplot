package com.fottheplot.FOT.controller;

import com.fottheplot.FOT.dto.ChatMessage;
import com.fottheplot.FOT.dto.PlaybackAction;
import com.fottheplot.FOT.dto.WebRTCAnswer;
import com.fottheplot.FOT.dto.WebRTCICECandidate;
import com.fottheplot.FOT.dto.WebRTCOffer;
import com.fottheplot.FOT.dto.Participant;
import com.fottheplot.FOT.dto.ParticipantUpdate;
import com.fottheplot.FOT.entity.Room;
import com.fottheplot.FOT.service.RoomService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class WebSocketController {

    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(RoomService roomService, SimpMessagingTemplate messagingTemplate) {
        this.roomService = roomService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/room/{roomId}/chat")
    public void sendMessage(@DestinationVariable String roomId, ChatMessage chatMessage) {
        messagingTemplate.convertAndSend("/topic/room/" + roomId, chatMessage);
    }

    @MessageMapping("/room/{roomId}/playback")
    public void handlePlaybackAction(@DestinationVariable Long roomId, PlaybackAction playbackAction, SimpMessageHeaderAccessor headerAccessor) {
        Room room = roomService.getRoomById(roomId);
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        if (!room.getHost().getUsername().equals(username)) {
            throw new RuntimeException("Only the host can control playback");
        }

        room.getPlaybackState().setPlaying("PLAY".equals(playbackAction.getType()));
        room.getPlaybackState().setPosition(playbackAction.getPosition());
        room.getPlaybackState().setLastUpdated(System.currentTimeMillis());
        roomService.saveRoom(room);

        playbackAction.setTimestamp(room.getPlaybackState().getLastUpdated());
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/playback", playbackAction);
    }

    @MessageMapping("/room/{roomId}/webrtc/offer")
    public void handleWebRTCOffer(@DestinationVariable Long roomId, WebRTCOffer offer) {
        // Forward the offer to the target participant
        messagingTemplate.convertAndSendToUser(String.valueOf(offer.getTargetParticipantId()), "/queue/room/" + roomId + "/webrtc/offer", offer);
    }

    @MessageMapping("/room/{roomId}/webrtc/answer")
    public void handleWebRTCAnswer(@DestinationVariable Long roomId, WebRTCAnswer answer) {
        // Forward the answer to the target participant
        messagingTemplate.convertAndSendToUser(String.valueOf(answer.getTargetParticipantId()), "/queue/room/" + roomId + "/webrtc/answer", answer);
    }

    @MessageMapping("/room/{roomId}/webrtc/ice-candidate")
    public void handleWebRTCICECandidate(@DestinationVariable Long roomId, WebRTCICECandidate candidate) {
        // Forward the ICE candidate to the target participant
        messagingTemplate.convertAndSendToUser(String.valueOf(candidate.getTargetParticipantId()), "/queue/room/" + roomId + "/webrtc/ice-candidate", candidate);
    }

    @MessageMapping("/room/{roomId}/join")
    public void joinRoom(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Room room = roomService.getRoomById(roomId);

        // Add participant to room
        com.fottheplot.FOT.entity.User user = roomService.findUserByUsername(username);
        if (user != null && !room.getParticipants().contains(user)) {
            room.getParticipants().add(user);
            roomService.saveRoom(room);
        }

        // Broadcast participant update
        List<Participant> participants = room.getParticipants().stream()
                .map(u -> new Participant(u.getId().toString(), u.getUsername(), u.getId().equals(room.getHost().getId())))
                .collect(Collectors.toList());
        Participant currentParticipant = new Participant(user.getId().toString(), user.getUsername(), user.getId().equals(room.getHost().getId()));
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/participants", new ParticipantUpdate(participants, "JOIN", currentParticipant));

        // Send current playback state to the newly joined user
        if (room.getMovie() != null && room.getPlaybackState() != null) {
            PlaybackAction currentPlaybackState = new PlaybackAction();
            currentPlaybackState.setType(room.getPlaybackState().isPlaying() ? "PLAY" : "PAUSE");
            currentPlaybackState.setPosition(room.getPlaybackState().getPosition());
            currentPlaybackState.setTimestamp(room.getPlaybackState().getLastUpdated());
            messagingTemplate.convertAndSendToUser(username, "/queue/room/" + roomId + "/playback-sync", currentPlaybackState);
        }
    }

    @MessageMapping("/room/{roomId}/leave")
    public void leaveRoom(@DestinationVariable Long roomId, SimpMessageHeaderAccessor headerAccessor) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        Room room = roomService.getRoomById(roomId);

        // Remove participant from room
        com.fottheplot.FOT.entity.User user = roomService.findUserByUsername(username);
        if (user != null) {
            room.getParticipants().removeIf(p -> p.getUsername().equals(username));
            roomService.saveRoom(room);
        }

        // Broadcast participant update
        List<Participant> participants = room.getParticipants().stream()
                .map(u -> new Participant(u.getId().toString(), u.getUsername(), u.getId().equals(room.getHost().getId())))
                .collect(Collectors.toList());
        Participant currentParticipant = new Participant(user.getId().toString(), user.getUsername(), user.getId().equals(room.getHost().getId()));
        messagingTemplate.convertAndSend("/topic/room/" + roomId + "/participants", new ParticipantUpdate(participants, "LEAVE", currentParticipant));
    }
}
