## STEP 1: AUTH (JWT)

- [x] Implement User & Role entity, repository, registration & login endpoints (`POST /api/auth/register`, `POST /api/auth/login`) with BCrypt and JWT tokens.
- [x] Implement SecurityConfig to protect endpoints, and a `/api/test/protected` that requires auth.

## STEP 2: MOVIES: Upload & CRUD

- [x] Create Movie and MediaFile entities and repositories.
- [x] Implement `POST /api/admin/movies` (ROLE_ADMIN) that accepts multipart `[file=@movie.mp4]` and `metadata` JSON. Store file in `media/` with UUID filename. Save metadata in DB.
- [x] Implement `GET /api/movies` (paged search by title and genre), `GET /api/movies/{id}`, `PUT /api/admin/movies/{id}` and `DELETE /api/admin/movies/{id}` (admin).
- [x] Added logging and error handling to the service layer.

## STEP 3: MEDIA STREAMING

- [x] Implement `GET /media/{mediaId}` which responds with full or partial content supporting `Range` header.
- [x] Implement `GET /api/media/{mediaId}/metadata`.

## STEP 4: ROOMS (REST + WebSocket basic)

- [x] Implement Room entity.
- [x] Implement REST endpoints to create/list/get rooms.
- [x] Add STOMP websocket at `/ws`.
- [x] Implement `/app/room/{roomId}/action` handling and broadcast to `/topic/room.{roomId}`.

## STEP 5: HOST CONTROLS & SYNC

- [x] Only host can send `PLAY/PAUSE/SEEK`.
- [x] Server enforces host.
- [x] Server persists `playbackState` per room.

## STEP 6: WEBRTC SIGNALING (optional)

- [x] Implement `webrtc` messages via STOMP forwarding `OFFER`, `ANSWER`, `ICE` to specific participants.

## STEP 7: ADMIN, MIGRATIONS, TESTS, DOCS

- [x] Add OpenAPI UI.

## STEP 8: TV SHOWS

- [x] Implement TvShow and Episode entities and repositories.
- [x] Implement `POST /api/admin/tvshows` (ROLE_ADMIN) that accepts multipart `[files=@episode1.mp4, @episode2.mp4]` and `metadata` JSON. Store files in `media/` with UUID filename. Save metadata in DB.
- [x] Implement `GET /api/tvshows` (paged search), `GET /api/tvshows/{id}`, `PUT /api/admin/tvshows/{id}` and `DELETE /api/admin/tvshows/{id}` (admin).
- [x] Added logging and error handling to the service layer.

## STEP 9: AUTHENTICATION WITH COOKIES

- [x] Modify `AuthController` to set the JWT as an HTTP-only cookie.
- [x] Modify `JwtRequestFilter` to extract JWT from cookie.