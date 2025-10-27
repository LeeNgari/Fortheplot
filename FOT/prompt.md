You are an experienced backend developer. Build a Spring Boot backend for "Fortheplot" (local-only media storage, no adaptive quality switching). Follow these strict rules:

1. Work iteratively — implement FEATURE A, run manual checks listed, confirm PASS, then proceed to FEATURE B. Do NOT implement multiple major features in the same step.
2. Use the dependencies specified: spring-boot-starter-web, starter-data-jpa, starter-security, starter-websocket, jjwt (or com.auth0 java-jwt), flyway, lombok, springdoc-openapi-ui, commons-io. Provide `pom.xml`.

STEP 1 — AUTH (JWT)

- Implement User & Role entity, repository, registration & login endpoints (`POST /api/auth/register`, `POST /api/auth/login`) with BCrypt and JWT tokens.
- Implement SecurityConfig to protect endpoints, and a `/api/test/protected` that requires auth.
  **CHECK**: Using curl:
  1. register user,
  2. login, receive token,
  3. access protected endpoint with token -> should return 200.
     If pass, respond: "STEP 1 PASS" and include sample curl commands + responses.

STEP 2 — MOVIES: Upload & CRUD

- Create Movie and MediaFile entities and repositories.
- Implement `POST /api/admin/movies` (ROLE_ADMIN) that accepts multipart `[file=@movie.mp4]` and `metadata` JSON. Store file in `media/` with UUID filename. Save metadata in DB.
- Implement `GET /api/movies` (paged search), `GET /api/movies/{id}`, `PUT` and `DELETE` (admin).
  **CHECK**:
  - Upload small mp4, confirm new DB rows and file on disk.
  - GET `/api/movies` returns the movie metadata.
    Respond with "STEP 2 PASS" and sample curl commands + file path listed.

STEP 3 — MEDIA STREAMING

- Implement `GET /media/{mediaId}` which responds with full or partial content supporting `Range` header. Add `GET /api/media/{mediaId}/metadata`.
  **CHECK**:
  - Use curl with `Range: bytes=0-` to request; browser `<video>` tag should play via `src="/media/{id}"`.
    Respond "STEP 3 PASS" with curl examples showing 206 Partial Content.

STEP 4 — ROOMS (REST + WebSocket basic)

- Implement Room entity and REST endpoints to create/list/get rooms.
- Add STOMP websocket at `/ws`. Implement `/app/room/{roomId}/action` handling and broadcast to `/topic/room.{roomId}`. Persist chat messages to DB.
  **CHECK**:
  - Connect two browser tabs via STOMP to `/topic/room.{id}`; send chat message from one tab to `/app/room/{id}/action {type:CHAT,...}`, both receive it and message is persisted.
    Respond "STEP 4 PASS" with test steps.

STEP 5 — HOST CONTROLS & SYNC

- Only host can send `PLAY/PAUSE/SEEK`. Server enforces host. Server persists `playbackState` per room and broadcasts `SYNC_SNAP` periodically.
  **CHECK**:
  - Host sends `PLAY` -> clients receive. If non-host tries to send `PLAY`, server rejects (403) and returns error to sender.
    Respond "STEP 5 PASS".

STEP 6 — WEBRTC SIGNALING (optional)

- Implement `webrtc` messages via STOMP forwarding `OFFER`, `ANSWER`, `ICE` to specific participants; enforce max 4 publishers.
  **CHECK**:
  - Simulate OFFER/ANSWER flow through server forwarding (no media validation). Respond "STEP 6 PASS".

STEP 7 — ADMIN, MIGRATIONS, TESTS, DOCS

- Add Flyway migrations, seed admin user, create unit/integration tests for auth, media streaming, and WebSocket flows. Add OpenAPI UI and README.
  **CHECK**: all tests pass.
  Respond "FINAL PASS".

At each step: produce only the code for that step, minimal changes outside the step).
