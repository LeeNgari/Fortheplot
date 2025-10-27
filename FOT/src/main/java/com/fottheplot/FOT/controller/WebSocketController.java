package com.fottheplot.FOT.controller;

import com.fottheplot.FOT.dto.ChatMessage;
import com.fottheplot.FOT.dto.PlaybackAction;
import com.fottheplot.FOT.dto.WebRTCAnswer;
import com.fottheplot.FOT.dto.WebRTCICECandidate;
import com.fottheplot.FOT.dto.WebRTCOffer;
import com.fottheplot.FOT.entity.Room;
import com.fottheplot.FOT.service.RoomService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    private final RoomService roomService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(RoomService roomService, SimpMessagingTemplate messagingTemplate) {
        this.roomService = roomService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/room/{roomId}/chat")
    @SendTo("/topic/room/{roomId}")
    public ChatMessage sendMessage(@DestinationVariable String roomId, ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/room/{roomId}/playback")
    @SendTo("/topic/room/{roomId}/playback")
    public PlaybackAction handlePlaybackAction(@DestinationVariable Long roomId, PlaybackAction playbackAction, SimpMessageHeaderAccessor headerAccessor) {
        Room room = roomService.getRoomById(roomId);
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        if (!room.getHost().getUsername().equals(username)) {
            throw new RuntimeException("Only the host can control playback");
        }

        room.getPlaybackState().setPlaying("PLAY".equals(playbackAction.getType()));
        room.getPlaybackState().setPosition(playbackAction.getPosition());
        room.getPlaybackState().setLastUpdated(System.currentTimeMillis());
        roomService.saveRoom(room);

        return playbackAction;
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
}
