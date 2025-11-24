# API Documentation

This document provides detailed documentation for all the APIs in the FOT project.

## Standard API Response

All API endpoints (except for media streaming) return a standardized JSON response object with the following structure:

```json
{
  "statusCode": "integer",
  "data": "object",
  "error": "string",
  "timestamp": "long"
}
```

- `statusCode`: The HTTP status code of the response.
- `data`: The data returned by the API. The structure of this object varies depending on the endpoint.
- `error`: An error message if the request failed, otherwise `null`.
- `timestamp`: The timestamp of the response in milliseconds.

---

## Authentication API

Controller: `AuthController`

### 1. User Login

- **Endpoint:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a JWT token in a cookie.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        "token": "string",
        "roles": ["string"]
      },
      "error": null,
      "timestamp": "long"
    }
    ```
  - **Headers:** Sets a `jwt` http-only cookie.

### 2. User Registration

- **Endpoint:** `/api/auth/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": "User registered successfully!",
      "error": null,
      "timestamp": "long"
    }
    ```
  - **Status:** `400 Bad Request`
  - **Body:**
    ```json
    {
      "statusCode": 400,
      "data": null,
      "error": "Username is already taken!",
      "timestamp": "long"
    }
    ```

---

## Media API

Controller: `MediaController`

### 1. Stream Media

- **Endpoint:** `/api/media/{mediaId}`
- **Method:** `GET`
- **Description:** Streams a media file. Supports range requests for partial content. This endpoint does not follow the standard API response format.
- **Path Variables:**
  - `mediaId` (long): The ID of the media file.
- **Request Headers:**
  - `Range` (string, optional): For partial content streaming (e.g., `bytes=0-1023`).
- **Response:**
  - **Status:** `200 OK` or `206 Partial Content`
  - **Body:** The media file resource.

### 2. Get Media Metadata

- **Endpoint:** `/api/media/{mediaId}/metadata`
- **Method:** `GET`
- **Description:** Retrieves metadata for a media file.
- **Path Variables:**
  - `mediaId` (long): The ID of the media file.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        "id": "long",
        "filename": "string",
        "contentType": "string",
        "size": "long"
      },
      "error": null,
      "timestamp": "long"
    }
    ```

---

## Movie API

Controller: `MovieController`

### 1. Create Movie

- **Endpoint:** `/api/movies`
- **Method:** `POST`
- **Description:** Creates a new movie. Requires `ROLE_ADMIN` authorization.
- **Request:** `multipart/form-data`
  - `metadata` (string, JSON):
    ```json
    {
      "title": "string",
      "description": "string",
      "releaseDate": "string (date)",
      "durationSeconds": "integer",
      "genre": "string",
      "posterPath": "string"
    }
    ```
  - `file` (file): The movie file.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // Movie object
      },
      "error": null,
      "timestamp": "long"
    }
    ```

### 2. Get Movies

- **Endpoint:** `/api/movies`
- **Method:** `GET`
- **Description:** Retrieves a paginated list of movies, with optional filtering.
- **Query Parameters:**
  - `title` (string, optional): Filter by movie title.
  - `genre` (string, optional): Filter by movie genre.
  - `page` (integer, optional): Page number for pagination.
  - `size` (integer, optional): Page size for pagination.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // Page of Movie objects
      },
      "error": null,
      "timestamp": "long"
    }
    ```

### 3. Get Trending Movies

- **Endpoint:** `/api/movies/trending`
- **Method:** `GET`
- **Description:** Retrieves 5 random movies.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": [
        // List of 5 random Movie objects
      ],
      "error": null,
      "timestamp": "long"
    }
    ```

### 4. Get Featured Movies

- **Endpoint:** `/api/movies/featured`
- **Method:** `GET`
- **Description:** Retrieves 5 random movies.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": [
        // List of 5 random Movie objects
      ],
      "error": null,
      "timestamp": "long"
    }
    ```

### 5. Get Popular Movies

- **Endpoint:** `/api/movies/popular`
- **Method:** `GET`
- **Description:** Retrieves 5 random movies.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": [
        // List of 5 random Movie objects
      ],
      "error": null,
      "timestamp": "long"
    }
    ```

### 6. Get Recent Movies

- **Endpoint:** `/api/movies/recent`
- **Method:** `GET`
- **Description:** Retrieves the 5 most recently released movies.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": [
        // List of 5 recent Movie objects
      ],
      "error": null,
      "timestamp": "long"
    }
    ```

### 7. Get Movie by ID

- **Endpoint:** `/api/movies/{id}`
- **Method:** `GET`
- **Description:** Retrieves a single movie by its ID.
- **Path Variables:**
  - `id` (long): The ID of the movie.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // Movie object
      },
      "error": null,
      "timestamp": "long"
    }
    ```

### 8. Delete Movie

- **Endpoint:** `/api/movies/{id}`
- **Method:** `DELETE`
- **Description:** Deletes a movie. Requires `ROLE_ADMIN` authorization.
- **Path Variables:**
  - `id` (long): The ID of the movie.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": null,
      "error": null,
      "timestamp": "long"
    }
    ```

### 9. Update Movie

- **Endpoint:** `/api/movies/{id}`
- **Method:** `PUT`
- **Description:** Updates a movie. Requires `ROLE_ADMIN` authorization.
- **Path Variables:**
  - `id` (long): The ID of the movie.
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "releaseDate": "string (date)",
    "durationSeconds": "integer",
    "genre": "string",
    "posterPath": "string"
  }
  ```
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // Updated Movie object
      },
      "error": null,
      "timestamp": "long"
    }
    ```

---

## Room API

Controller: `RoomController`

### 1. Create Room

- **Endpoint:** `/api/rooms`
- **Method:** `POST`
- **Description:** Creates a new room.
- **Request Body:**
  ```json
  {
    "name": "string",
    "public": "boolean",
    "password": "string (optional)",
    "movieId": "long (optional)"
  }
  ```
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // Room object
      },
      "error": null,
      "timestamp": "long"
    }
    ```

### 2. Get Public Rooms

- **Endpoint:** `/api/rooms`
- **Method:** `GET`
- **Description:** Retrieves a paginated list of public rooms.
- **Query Parameters:**
  - `page` (integer, optional): Page number for pagination.
  - `size` (integer, optional): Page size for pagination.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // Page of Room objects
      },
      "error": null,
      "timestamp": "long"
    }
    ```

### 3. Get Room by ID

- **Endpoint:** `/api/rooms/{id}`
- **Method:** `GET`
- **Description:** Retrieves a single room by its ID.
- **Path Variables:**
  - `id` (long): The ID of the room.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // Room object
      },
      "error": null,
      "timestamp": "long"
    }
    ```

---

## TV Show API

Controller: `TvShowController`

### 1. Create TV Show

- **Endpoint:** `/api/tvshows`
- **Method:** `POST`
- **Description:** Creates a new TV show. Requires `ROLE_ADMIN` authorization.
- **Request:** `multipart/form-data`
  - `metadata` (string, JSON):
    ```json
    {
      "title": "string",
      "description": "string",
      "releaseDate": "string (date)",
      "genre": "string",
      "posterPath": "string",
      "episodes": [
        {
          "title": "string",
          "episodeNumber": "integer",
          "durationSeconds": "integer"
        }
      ]
    }
    ```
  - `files` (list of files): The episode files.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // TvShow object
      },
      "error": null,
      "timestamp": "long"
    }
    ```

### 2. Get TV Shows

- **Endpoint:** `/api/tvshows`
- **Method:** `GET`
- **Description:** Retrieves a paginated list of TV shows, with optional filtering.
- **Query Parameters:**
  - `title` (string, optional): Filter by TV show title.
  - `genre` (string, optional): Filter by TV show genre.
  - `page` (integer, optional): Page number for pagination.
  - `size` (integer, optional): Page size for pagination.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // Page of TvShow objects
      },
      "error": null,
      "timestamp": "long"
    }
    ```

### 3. Get TV Show by ID

- **Endpoint:** `/api/tvshows/{id}`
- **Method:** `GET`
- **Description:** Retrieves a single TV show by its ID.
- **Path Variables:**
  - `id` (long): The ID of the TV show.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // TvShow object
      },
      "error": null,
      "timestamp": "long"
    }
    ```

### 4. Delete TV Show

- **Endpoint:** `/api/tvshows/{id}`
- **Method:** `DELETE`
- **Description:** Deletes a TV show. Requires `ROLE_ADMIN` authorization.
- **Path Variables:**
  - `id` (long): The ID of the TV show.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": null,
      "error": null,
      "timestamp": "long"
    }
    ```

### 5. Update TV Show

- **Endpoint:** `/api/tvshows/{id}`
- **Method:** `PUT`
- **Description:** Updates a TV show. Requires `ROLE_ADMIN` authorization.
- **Path Variables:**
  - `id` (long): The ID of the TV show.
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "releaseDate": "string (date)",
    "genre": "string",
    "posterPath": "string"
  }
  ```
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        // Updated TvShow object
      },
      "error": null,
      "timestamp": "long"
    }
    ```

---

## Search API

Controller: `SearchController`

### 1. Search Movies and TV Shows

- **Endpoint:** `/api/search`
- **Method:** `GET`
- **Description:** Searches for both movies and TV shows by title.
- **Query Parameters:**
  - `query` (string): The search query.
  - `page` (integer, optional): Page number for pagination.
  - `size` (integer, optional): Page size for pagination.
- **Response:**
  - **Status:** `200 OK`
  - **Body:**
    ```json
    {
      "statusCode": 200,
      "data": {
        "movies": [
          // list of Movie objects
        ],
        "tvShows": [
          // list of TvShow objects
        ]
      },
      "error": null,
      "timestamp": "long"
    }
    ```

---

## WebSocket API

Controller: `WebSocketController`

### 1. Send Chat Message

- **Destination:** `/app/room/{roomId}/chat`
- **Subscribes to:** `/topic/room/{roomId}`
- **Description:** Sends a chat message to a room.
- **Message Body:**
  ```json
  {
    "sender": "string",
    "content": "string",
    "type": "string (e.g., 'CHAT', 'JOIN', 'LEAVE')"
  }
  ```
- **Broadcasts:** The received `ChatMessage` to all subscribers of the topic.

### 2. Handle Playback Action

- **Destination:** `/app/room/{roomId}/playback`
- **Subscribes to:** `/topic/room/{roomId}/playback`
- **Description:** Handles playback actions (e.g., play, pause) for a room. Only the room host can send this message.
- **Message Body:**
  ```json
  {
    "type": "string (e.g., 'PLAY', 'PAUSE')",
    "position": "double"
  }
  ```
- **Broadcasts:** The received `PlaybackAction` to all subscribers of the topic.

### 3. WebRTC Offer

- **Destination:** `/app/room/{roomId}/webrtc/offer`
- **Description:** Forwards a WebRTC offer to a specific participant in a room.
- **Message Body:**
  ```json
  {
    "targetParticipantId": "long",
    "sdp": "string"
  }
  ```
- **Forwards to:** `/user/{targetParticipantId}/queue/room/{roomId}/webrtc/offer`

### 4. WebRTC Answer

- **Destination:** `/app/room/{roomId}/webrtc/answer`
- **Description:** Forwards a WebRTC answer to a specific participant in a room.
- **Message Body:**
  ```json
  {
    "targetParticipantId": "long",
    "sdp": "string"
  }
  ```
- **Forwards to:** `/user/{targetParticipantId}/queue/room/{roomId}/webrtc/answer`

### 5. WebRTC ICE Candidate

- **Destination:** `/app/room/{roomId}/webrtc/ice-candidate`
- **Description:** Forwards a WebRTC ICE candidate to a specific participant in a room.
- **Message Body:**
  ```json
  {
    "targetParticipantId": "long",
    "candidate": "string",
    "sdpMid": "string",
    "sdpMLineIndex": "integer"
  }
  ```
- **Forwards to:** `/user/{targetParticipantId}/queue/room/{roomId}/webrtc/ice-candidate`

---

## Data Models

### Movie

```json
{
  "id": "long",
  "title": "string",
  "description": "string",
  "releaseDate": "string (date)",
  "durationSeconds": "integer",
  "genre": "string",
  "posterPath": "string",
  "mediaFile": {
    // MediaFile object
  }
}
```

### TvShow

```json
{
  "id": "long",
  "title": "string",
  "description": "string",
  "releaseDate": "string (date)",
  "genre": "string",
  "posterPath": "string",
  "episodes": [
    // List of Episode objects
  ]
}
```

### Episode

```json
{
  "id": "long",
  "title": "string",
  "description": "string",
  "episodeNumber": "integer",
  "durationSeconds": "integer",
  "mediaFile": {
    // MediaFile object
  }
}
```

### Room

```json
{
  "id": "long",
  "name": "string",
  "public": "boolean",
  "host": {
    // User object
  },
  "movie": {
    // Movie object
  },
  "playbackState": {
    "playing": "boolean",
    "position": "double",
    "lastUpdated": "long"
  }
}
```

### MediaFile

```json
{
  "id": "long",
  "filename": "string",
  "contentType": "string",
  "size": "long"
}
```