# API Documentation

This document provides a comprehensive overview of the backend APIs for the Radiant Movie Haven application.

## Table of Contents

1.  [Authentication Endpoints](#authentication-endpoints)
2.  [Movie Endpoints](#movie-endpoints)
3.  [TV Show Endpoints](#tv-show-endpoints)
4.  [Media Endpoints](#media-endpoints)
5.  [Room Endpoints](#room-endpoints)
6.  [Test Endpoints](#test-endpoints)
7.  [WebSocket Endpoints](#websocket-endpoints)

---









## 4. Media Endpoints









### 4.1. Stream Media









**URL:** `/api/media/{mediaId}`









**Method:** `GET`









**Description:** Streams media content (video/audio) by its ID. Supports range requests for partial content.









**Headers:**









*   `Authorization: Bearer <JWT_TOKEN>` (Optional)




*   `Range`: `String` (Optional - e.g., `bytes=0-1023` for partial content requests)









**Path Parameters:**









*   `mediaId` (Required): `Long` - The ID of the media file.









**Response Body:**









*   **Success (200 OK or 206 Partial Content):** `Resource` (The media file stream).




*   **Failure (404 Not Found):** Error message.









**User Roles:** Any authenticated user (or unauthenticated for public access if configured).









### 4.2. Get Media Metadata









**URL:** `/api/media/{mediaId}/metadata`









**Method:** `GET`









**Description:** Retrieves metadata for a media file by its ID.









**Headers:**









*   `Authorization: Bearer <JWT_TOKEN>` (Optional)









**Path Parameters:**









*   `mediaId` (Required): `Long` - The ID of the media file.









**Response Body:**









*   **Success (200 OK):** `MediaFile` object.




    *   `id`: `Long`




    *   `filename`: `String`




    *   `contentType`: `String`




    *   `size`: `Long`




*   **Failure (404 Not Found):** Error message.









**User Roles:** Any authenticated user (or unauthenticated for public access if configured).





