2) High-level implementation plan — extremely detailed, step-by-step
I’ll split into milestones / sprints. Each sprint has tasks, verification steps, and "done" criteria. Implement backend only (per your request). Assume 2-week sprints but you can adapt.



Sprint 1 — Auth & Users (core foundation)
 Goal: secure API with JWT, user registration/login, roles (ROLE_USER, ROLE_ADMIN).
 Tasks:
Create User, Role entities + JPA repositories.


Implement AuthController endpoints: /api/auth/register, /api/auth/login, /api/auth/refresh (optional). Register stores hashed password (BCrypt).


Implement JWT generation/validation filter + SecurityConfig to secure endpoints.


Implement UserController for user profile, admin user list (CRUD for admin).
Sprint 2 — Movie & TV metadata (catalog) + local file upload/storage
 Goal: CRUD for movies & tv shows, upload MP4 stored locally, metadata stored in DB. Note: user said no quality change — we will store original MP4 and serve via HTTP byte-ranges for smooth playback; no HLS segmentation or quality switching.
Tasks:
Create entities: Movie, TvShow, MediaFile (file path, size, mime).


Create MovieController endpoints (admin) to create/update/delete movies — accept multipart form with metadata JSON + file. Store file in media/ folder in project root. Use unique file names (UUID). Save file path & metadata in DB.


Implement MediaController for streaming: GET /media/{id} supports Range header to stream MP4. (This enables player to play and seeks.)


Pagination and search endpoints: GET /api/movies?page=0&size=20&title=...&genre=.... Implement search by title/actor/genre. Use JpaSpecificationExecutor for flexible search.


Add validations on uploaded file types (video/mp4) and maximum size.
 Verify: upload a movie via curl -F "file=@movie.mp4" -F "metadata={...}" and verify playback by requesting /media/{id} from a browser or curl with Range header.
 Done: CRUD and streaming working locally.


Sprint 3 — Rooms: creation, join, host controls & sync engine (WebSocket + DB)
 Goal: rooms for synchronized viewing, host controls, persistent chat messages.
Tasks:
Entities: Room, RoomParticipant, Message (with timestamp, sender, room).


REST endpoints:


POST /api/rooms (auth) create room (private/public, password optional, movieId optional).


GET /api/rooms list public rooms.


GET /api/rooms/{id} get room details.


WebSocket setup: Use STOMP over WebSocket at /ws. Configure topic /topic/room.{roomId} and app destination /app/room.{roomId}.


Define message types for signalling:


PLAY, PAUSE, SEEK, SYNC_REQUEST, SYNC_SNAP (server sends authoritative position), CHAT_MESSAGE, JOIN, LEAVE, HOST_CHANGE, KICK.


Implement server broadcast of host actions to /topic/room.{id}. Only host messages affect playback state (server verifies role).


Implement persistent chat: messages saved to DB and sent over WebSocket. REST: GET /api/rooms/{id}/messages?page=0&size=50.


Implement room participant management: when user joins via WebSocket, create RoomParticipant record; when leaves, set leftAt.
 Verify: multiple browser tabs (or Postman + WebSocket client) can connect and receive/playback events; host actions broadcast; chat messages persist and replay when joining.
 Done: rooms + chat + host controls working.


If a user creates a room they become a host of a room and they have complete power for that room crud  and kicking users
Sprint 4 — Synchronization robustness & graceful reconnect
 Goal: make sync resilient to drift and reconnections.
Tasks:
Implement periodic SYNC_SNAP from host every N seconds (e.g., 5s). Server enforces master time and sends corrections.


On join, server sends current playback state + host timestamp; new clients sync to that time.


Implement buffer logic in client (frontend) — backend provides endpoints to query file length and current position. (You’ll instruct front-end dev to use this; back-end exposes /api/media/{id}/metadata.)


Implement reconnection handling: on reconnect, client requests last state; server returns latest timecode.
 Verify: simulate network latency to check drift correction.


Sprint 5 — WebRTC signalling & optional peer video/audio in room (max 4)
 Goal: enable peer-to-peer audio/video in room using WebRTC; backend only implements signalling via WebSocket.
Tasks:
Add STOMP messages for WebRTC SDP_OFFER, SDP_ANSWER, ICE_CANDIDATE. Server simply forwards to target peer (no media relay).


Add server-side checks to limit max concurrent video streams per room (4). If more try to publish, reject.


Provide TURN configuration in config (not hosting TURN; you can rely on public STUN servers for dev, but include instructions how to set up TURN if needed).
 Verify: two browsers can establish peer connection for audio/video (use front-end). Backend only handles signalling — test with WebRTC demo client.


Sprint 6 — Admin UI endpoints, moderation & analytics endpoints
 Goal: admin CRUD, moderation tools, basic analytics endpoints.
Tasks:
Admin endpoints: manage users, movies, rooms, view usage stats (total rooms created, messages count). Implement admin DTOs.


3) Suggested Project Structure (packages + folders)
fortheplot-backend/
├─ src/main/java/com/fortheplot/
│  ├─ config/
│  │   ├─ SecurityConfig.java
│  │   ├─ WebSocketConfig.java
│  │   ├─ SwaggerConfig.java
│  ├─ controller/
│  │   ├─ AuthController.java
│  │   ├─ UserController.java
│  │   ├─ MovieController.java
│  │   ├─ MediaController.java   // serves /media/{id} with Range support
│  │   ├─ RoomController.java
│  │   ├─ AdminController.java
│  ├─ dto/
│  │   ├─ AuthDtos, MovieDtos, RoomDtos, MessageDtos
│  ├─ entity/
│  │   ├─ User.java
│  │   ├─ Role.java
│  │   ├─ Movie.java
│  │   ├─ MediaFile.java
│  │   ├─ Room.java
│  │   ├─ RoomParticipant.java
│  │   ├─ Message.java
│  ├─ repository/
│  ├─ service/
│  │   ├─ AuthService.java
│  │   ├─ UserService.java
│  │   ├─ MovieService.java
│  │   ├─ MediaService.java
│  │   ├─ RoomService.java
│  ├─ websocket/
│  │   ├─ WebSocketEventHandler.java
│  │   ├─ StompControllers (for app/** messages)
│  ├─ util/
│  │   ├─ JwtUtil.java
│  │   ├─ FileStorageUtil.java
│  └─ FortheplotApplication.java
├─ src/main/resources/
│  ├─ application-dev.yml
│  ├─ application-prod.yml
│  ├─ static/ (optional sample front-end)
├─ media/          // local folder to store uploaded mp4s (outside resources)
├─ docs/
│  ├─ api.md
└─ pom.xml

Notes:
Keep media/ outside classpath so large files are not loaded into jar. Use path configured in application.yml (e.g., media.storage.path = /home/lee/fortheplot/media).



4) Entities (fields) & sample SQL
I’ll present the essential fields. Use JPA annotations; indexes on title, roomId.





Movie
id UUID


title varchar


description text


releaseDate date


durationSeconds int


genre varchar


posterPath string


mediaFile (one-to-one MediaFile)


createdBy (user id), createdAt


MediaFile
id UUID


filename (stored file name)


originalFileName


path (absolute or relative path)


mimeType (video/mp4)


sizeBytes


TvShow` (if modeled separately)
id UUID


title, description, etc.


Room
id UUID


name


hostId (User)



isPublic boolean


passwordHash optional


createdAt


playbackState JSON / separate table (currentPosition, playing boolean, lastUpdatedAt)


RoomParticipant
id, roomId, userId, isHost, joinedAt, leftAt, isMuted, isVideoEnabled


Message
id, roomId, userId, content, sentAt



5) API Design (detailed)
I’ll show endpoints, HTTP method, auth requirement, request & response shape.
Auth
POST /api/auth/register
 Body: { "username": "...", "email":"...","password":"..." }
 Response: 201 { "id": "...", "username":"...", "token": "jwt..." }


POST /api/auth/login
 Body: { "username":"...", "password":"..." }
 Response: { "token":"...", "expiresIn":3600 }


Users
GET /api/users/me — Auth required — returns profile.


PUT /api/users/me — update profile (no password here).


GET /api/admin/users — ROLE_ADMIN — list users (paged).


Movies & Media
POST /api/admin/movies — ROLE_ADMIN only — multipart/form-data: metadata JSON field + file mp4
 Response: 201 { "id": "movie-id", "mediaId": "..." }


GET /api/movies — public — query params page,size,search,genre — list of movie DTOs.


GET /api/movies/{id} — movie details (includes mediaId).


PUT /api/admin/movies/{id} — update metadata.


DELETE /api/admin/movies/{id} — delete movie & media file.


GET /api/media/{mediaId} — streaming endpoint (supports Range header). No auth required for public movies, but restrict if movie is private.


GET /api/media/{mediaId}/metadata — returns durationSeconds, sizeBytes, mimeType.


TV Shows
CRUD similar to movies, but support season and episode entities. Endpoints:


GET /api/tvshows, GET /api/tvshows/{id}, POST /api/admin/tvshows, POST /api/admin/episodes (upload episode media).


Rooms
POST /api/rooms — create: body { name, isPublic, password (optional), movieId (optional) } — returns room id + ws topic. Auth required.


GET /api/rooms — list public rooms (paged).


GET /api/rooms/{id} — room info, current playback state.


POST /api/rooms/{id}/join — optional for REST (mostly via WebSocket/WS handshake), for invites. Accept password if required.


GET /api/rooms/{id}/messages?page=0&size=50 — get last messages.


POST /api/rooms/{id}/kick — Host or admin only — body { participantId }.


WebSocket (STOMP)
Endpoint: ws://<host>/ws (SockJS fallback allowed)


Subscribe topics:


/topic/room.{roomId} — room-wide broadcast events (play/pause/chat/kick/host-change).


/user/queue/room.{roomId} — personal messages (e.g., targeted WebRTC offer).


Send to app destinations:


/app/room/{roomId}/action — body { type: "PLAY"|"PAUSE"| "SEEK"|"CHAT"|... , payload: {...} }


/app/room/{roomId}/webrtc — type: OFFER/ANSWER/ICE, payload includes targetParticipantId and sdp/ice.


Message shapes (examples)
Playback action:


{ "type":"PLAY", "timestamp": 1680000000000, "positionSeconds": 123.45, "sentBy": "userId" }

Chat message:


{ "type":"CHAT", "messageId":"...", "senderId":"...", "content":"hey", "sentAt": "2025-10-01T12:00:00Z" }

Sync snap:


{ "type":"SYNC_SNAP", "positionSeconds": 123.45, "hostTime": 1680000000000 }


6) Real-time flow & WebRTC signalling (backend responsibilities)
WebSocket / STOMP responsibilities
Provide STOMP endpoint /ws and configure allowed origins. Use SockJS for browsers that need fallback.


Map topics: /topic/room.{roomId} for broadcasts; /app/room/{roomId}/action for incoming messages forwarded by server after validation.


Enforce authorization on connect (JWT passed via header or connect message). Deny connect if invalid.


When host sends playback events (PLAY/PAUSE/SEEK) the server:


Validates sender is host (or has admin override).


Persists a minimal playback state (time and playing bool) in Room or ephemeral cache.


Broadcasts event to /topic/room.{roomId}.


Chat messages: persist to DB and broadcast.


WebRTC signalling
Server acts only as signalling relay (no media path unless you decide to host SFU/MCU). Flow:


Client A sends OFFER (STOMP message) to /app/room/{id}/webrtc with targetParticipantId.


Server forwards to /user/{target}/queue/room.{id} with payload.


Target responds with ANSWER. ICE candidates forwarded likewise.


Enforce maximum simultaneous publishers per room (4). Keep a counter of videoPublishers.



7) Local media storage & streaming (practical details)
You said: movies and tv shows will be stored and served locally and no user quality change. So do single-file MP4 storage + Range-based streaming.
Uploading
Accept multipart: multipart/form-data with file and metadata JSON.


Save file using secure name: UUID + extension. Store original filename & path in DB (MediaFile.path). Example path: /opt/fortheplot/media/0f3a...mp4.


Serving for playback (Range requests)
Implement a controller that reads Range header and returns 206 Partial Content with Content-Range and Accept-Ranges: bytes.


This allows HTML5 <video> tag (or HLS.js if you later choose) to play and seek.


Ensure proper Content-Type: video/mp4 and Content-Length for full/partial responses.


Example endpoint: GET /media/{mediaId} returning a Resource/InputStreamResource with range support.


Security considerations locally
Prevent directory traversal (sanitize file paths).


Check file type server-side (magic bytes) in addition to extension.


Limit file size and streaming rate if required (not necessary for local dev).



Add detailed helpful logs for every request showing which request came in and how long it took and also messages and errors incase clean files not large files with too many methods
8) Extra details you might have forgotten (and recommendations)
Rate limiting on endpoints that could be abused (auth endpoints). Useful for final demo but optional.


Backups: export DB and media folder before demos.


Admin account seed: add Flyway migration to create admin user with strong password (or step in README to create).


Logging: centralized structured logs for WebSocket events to debug sync issues.


Testing plan: unit tests for JWT filter, MediaController range handling, integration test for WebSocket messaging (Spring’s WebSocketStompClient test support).


Client contract doc: explicitly document STOMP message types and expected client reconnection behavior. This will save front-end time.


Performance: serving large MP4s from spring app is fine for local demo; for scale you'd serve from a static file server — but not required.




suggested project structure
fortheplot-backend/
├─ src/main/java/com/fortheplot/
│  ├─ config/
│  │   ├─ SecurityConfig.java
│  │   ├─ WebSocketConfig.java
│  │   ├─ SwaggerConfig.java
│  ├─ controller/
│  │   ├─ AuthController.java
│  │   ├─ UserController.java
│  │   ├─ MovieController.java
│  │   ├─ MediaController.java   // serves /media/{id} with Range support
│  │   ├─ RoomController.java
│  │   ├─ AdminController.java
│  ├─ dto/
│  │   ├─ AuthDtos, MovieDtos, RoomDtos, MessageDtos
│  ├─ entity/
│  │   ├─ User.java
│  │   ├─ Role.java
│  │   ├─ Movie.java
│  │   ├─ MediaFile.java
│  │   ├─ Room.java
│  │   ├─ RoomParticipant.java
│  │   ├─ Message.java
│  ├─ repository/
│  ├─ service/
│  │   ├─ AuthService.java
│  │   ├─ UserService.java
│  │   ├─ MovieService.java
│  │   ├─ MediaService.java
│  │   ├─ RoomService.java
│  ├─ websocket/
│  │   ├─ WebSocketEventHandler.java
│  │   ├─ StompControllers (for app/** messages)
│  ├─ util/
│  │   ├─ JwtUtil.java
│  │   ├─ FileStorageUtil.java
│  └─ FortheplotApplication.java
├─ src/main/resources/
│  ├─ application-dev.yml
│  ├─ application-prod.yml
│  ├─ static/ (optional sample front-end)
├─ media/          // local folder to store uploaded mp4s (outside resources)
├─ docs/
│  ├─ api.md
└─ pom.xml
