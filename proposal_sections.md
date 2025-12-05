# ForThePlot - Final Project Proposal Sections

## Acronyms

| Acronym | Full Form |
|---------|-----------|
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| DTO | Data Transfer Object |
| HTTP | Hypertext Transfer Protocol |
| ICE | Interactive Connectivity Establishment |
| JPA | Java Persistence API |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| MIME | Multipurpose Internet Mail Extensions |
| MVC | Model-View-Controller |
| ORM | Object-Relational Mapping |
| REST | Representational State Transfer |
| RTC | Real-Time Communication |
| SDP | Session Description Protocol |
| SPA | Single Page Application |
| SQL | Structured Query Language |
| STOMP | Simple Text Oriented Messaging Protocol |
| UI | User Interface |
| UX | User Experience |
| WebRTC | Web Real-Time Communication |
| WebSocket | Web Socket Protocol |

---

## Chapter 5: Coding

### 5.1 Section Overview

The ForThePlot application is a full-stack web-based synchronized video streaming platform that enables users to watch movies and TV shows together in real-time virtual rooms. The system architecture follows a client-server model with a clear separation between frontend and backend components, communicating through RESTful APIs and WebSocket connections for real-time synchronization.

The application is built using modern web technologies:
- **Backend**: Spring Boot framework with Java 21, providing a robust and scalable server-side infrastructure
- **Frontend**: React with TypeScript and Vite, delivering a responsive and interactive user interface
- **Database**: PostgreSQL for persistent data storage with Flyway for database migrations
- **Real-time Communication**: WebSocket with STOMP protocol for chat and playback synchronization, and WebRTC for peer-to-peer video streaming

The codebase is organized following industry best practices with clear separation of concerns, modular architecture, and comprehensive API documentation.

### 5.2 Frontend

#### 5.2.1 Technology Stack

The frontend application is built as a modern Single Page Application (SPA) using the following core technologies:

- **React 18.3.1**: A JavaScript library for building user interfaces with component-based architecture
- **TypeScript 5.5.3**: Provides static type checking for improved code quality and developer experience
- **Vite 5.4.1**: A fast build tool and development server optimized for modern web projects
- **React Router DOM 6.26.2**: Client-side routing for navigation between different pages
- **TanStack Query 5.56.2**: Data fetching and state management for server state
- **Axios 1.12.2**: HTTP client for making API requests to the backend

#### 5.2.2 UI Framework and Components

The user interface leverages a comprehensive component library built on top of Radix UI primitives with custom styling:

- **Radix UI**: Unstyled, accessible component primitives for building high-quality design systems
- **Tailwind CSS 3.4.11**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Pre-built, customizable components following modern design patterns
- **Framer Motion 12.23.24**: Animation library for smooth transitions and interactions
- **Lucide React**: Icon library providing consistent visual elements

#### 5.2.3 Application Structure

The frontend follows a well-organized directory structure:

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (buttons, dialogs, forms)
│   └── layout/      # Layout components (header, footer, navigation)
├── pages/           # Route-level page components
├── context/         # React Context providers (AuthContext)
├── hooks/           # Custom React hooks for shared logic
├── lib/             # Utility functions and helpers
├── types/           # TypeScript type definitions
└── data/            # Static data and constants
```

#### 5.2.4 Key Features Implementation

**Authentication Flow**
- JWT-based authentication with secure token storage
- AuthContext provider for managing authentication state across the application
- Protected routes requiring authentication
- Login and registration pages with form validation using React Hook Form and Zod

**Movie and TV Show Browsing**
- Explore page displaying movies and TV shows with filtering and pagination
- Search functionality with real-time results
- Movie details page showing comprehensive information and playback options
- Responsive grid layouts adapting to different screen sizes

**Room Management**
- Rooms listing page showing available public rooms
- Room creation with options for public/private access and password protection
- Room page with integrated video player and chat interface

**Real-time Features**
- WebSocket connection using STOMP.js for real-time communication
- Chat messaging system with message history
- Synchronized playback controls (play, pause, seek) across all participants
- WebRTC integration for peer-to-peer video streaming

#### 5.2.5 State Management

The application uses multiple state management approaches:

- **React Query**: Server state management for API data fetching, caching, and synchronization
- **React Context**: Global state for authentication and user information
- **Local Component State**: UI state managed within individual components using useState and useReducer hooks

### 5.3 Backend

#### 5.3.1 Technology Stack

The backend is built using the Spring Boot ecosystem with the following key dependencies:

- **Spring Boot 3.5.7**: Core framework providing dependency injection, auto-configuration, and production-ready features
- **Spring Data JPA**: Object-Relational Mapping (ORM) for database interactions
- **Spring Security**: Authentication and authorization framework
- **Spring WebSocket**: WebSocket support with STOMP messaging
- **PostgreSQL**: Relational database for persistent data storage
- **Flyway**: Database migration tool for version control of database schema
- **Lombok**: Reduces boilerplate code with annotations
- **JJWT 0.11.5**: JWT token generation and validation
- **SpringDoc OpenAPI 2.5.0**: API documentation generation

#### 5.3.2 Architecture Pattern

The backend follows the layered architecture pattern with clear separation of responsibilities:

**Controller Layer**
- Handles HTTP requests and responses
- Input validation and error handling
- Maps DTOs to domain entities
- Controllers: AuthController, MovieController, TvShowController, RoomController, MediaController, SearchController, WebSocketController

**Service Layer**
- Contains business logic and orchestration
- Transaction management
- Coordinates between multiple repositories
- Services: AuthService, MovieService, TvShowService, RoomService, MediaService, UserService

**Repository Layer**
- Data access abstraction using Spring Data JPA
- Custom query methods using JPQL and specifications
- Repositories: MovieRepository, TvShowRepository, RoomRepository, MediaFileRepository, UserRepository, RoleRepository

**Entity Layer**
- JPA entities representing database tables
- Relationships between entities (One-to-Many, Many-to-One, Many-to-Many)
- Entities: User, Role, Movie, TvShow, Episode, Room, MediaFile, PlaybackState, Comment

#### 5.3.3 Security Implementation

**Authentication**
- JWT-based stateless authentication
- Custom JwtRequestFilter for token validation on each request
- JwtAuthenticationEntryPoint for handling unauthorized access
- Password encryption using BCrypt

**Authorization**
- Role-based access control (RBAC) with USER and ADMIN roles
- Method-level security using @PreAuthorize annotations
- Secured WebSocket endpoints with user-specific message queues

**CORS Configuration**
- Configured to allow frontend origin
- Credentials support for cookie-based authentication
- Specific allowed methods and headers

#### 5.3.4 API Design

The backend exposes RESTful APIs following standard conventions:

**Standardized Response Format**
```json
{
  "statusCode": 200,
  "data": {},
  "error": null,
  "timestamp": 1234567890
}
```

**Key API Endpoints**

*Authentication APIs*
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login with JWT token generation

*Movie APIs*
- GET `/api/movies` - Paginated list of movies with filtering
- GET `/api/movies/{id}` - Movie details
- POST `/api/movies` - Create movie (Admin only)
- PUT `/api/movies/{id}` - Update movie (Admin only)
- DELETE `/api/movies/{id}` - Delete movie (Admin only)
- GET `/api/movies/trending` - Trending movies
- GET `/api/movies/featured` - Featured movies

*TV Show APIs*
- GET `/api/tvshows` - Paginated list of TV shows
- GET `/api/tvshows/{id}` - TV show details with episodes
- POST `/api/tvshows` - Create TV show with episodes (Admin only)
- PUT `/api/tvshows/{id}` - Update TV show (Admin only)
- DELETE `/api/tvshows/{id}` - Delete TV show (Admin only)

*Room APIs*
- GET `/api/rooms` - List public rooms
- GET `/api/rooms/{id}` - Room details
- POST `/api/rooms` - Create new room

*Media Streaming API*
- GET `/api/media/{mediaId}` - Stream media with range request support

*Search API*
- GET `/api/search?query={query}` - Search movies and TV shows

#### 5.3.5 WebSocket Implementation

The application uses WebSocket with STOMP protocol for real-time features:

**Message Destinations**
- `/app/room/{roomId}/chat` - Send chat messages
- `/app/room/{roomId}/playback` - Playback control actions
- `/app/room/{roomId}/webrtc/offer` - WebRTC offer signaling
- `/app/room/{roomId}/webrtc/answer` - WebRTC answer signaling
- `/app/room/{roomId}/webrtc/ice-candidate` - ICE candidate exchange

**Subscription Topics**
- `/topic/room/{roomId}` - Broadcast chat messages to all room participants
- `/topic/room/{roomId}/playback` - Broadcast playback state changes
- `/user/{userId}/queue/room/{roomId}/webrtc/*` - User-specific WebRTC signaling

#### 5.3.6 Media Storage and Streaming

**File Upload**
- Multipart file upload for movies and TV show episodes
- File validation (size, type)
- Storage in database as binary data (BLOB)

**Streaming**
- HTTP range request support for partial content delivery
- Efficient streaming of large video files
- Content-Type headers for proper media playback

#### 5.3.7 Database Schema

The PostgreSQL database schema includes the following main tables:

- **users**: User accounts with username, email, and encrypted password
- **roles**: User roles (USER, ADMIN)
- **user_roles**: Many-to-many relationship between users and roles
- **movies**: Movie metadata (title, description, genre, release date, duration)
- **tv_shows**: TV show metadata
- **episodes**: Individual episodes belonging to TV shows
- **media_files**: Binary storage of video files
- **rooms**: Virtual rooms for synchronized viewing
- **playback_state**: Current playback state for each room
- **comments**: User comments on movies and TV shows

### 5.4 Room Workflow

The room workflow is the core feature of ForThePlot, enabling synchronized video watching experiences. The workflow involves multiple components working together:

#### 5.4.1 Room Creation

1. **User initiates room creation** from the frontend
2. **Frontend sends POST request** to `/api/rooms` with room details:
   - Room name
   - Public/private flag
   - Optional password for private rooms
   - Optional movie/TV show selection
3. **Backend validates request** and checks authentication
4. **Room entity is created** in the database with:
   - Host assigned as the creating user
   - Initial playback state (paused at position 0)
   - Unique room ID generated
5. **Response returned** with room details
6. **Frontend redirects** user to the room page

#### 5.4.2 Joining a Room

1. **User navigates** to room page via room ID
2. **Frontend fetches room details** via GET `/api/rooms/{id}`
3. **Password verification** if room is private
4. **WebSocket connection established** to the backend
5. **User subscribes** to room-specific topics:
   - `/topic/room/{roomId}` for chat messages
   - `/topic/room/{roomId}/playback` for playback synchronization
6. **JOIN message sent** to notify other participants
7. **User receives current playback state** to synchronize video position

#### 5.4.3 Synchronized Playback

**Host Controls**
1. **Host performs action** (play, pause, seek) on video player
2. **Frontend sends playback action** via WebSocket to `/app/room/{roomId}/playback`
3. **Backend validates** that sender is the room host
4. **Playback state updated** in database
5. **Action broadcasted** to all subscribers via `/topic/room/{roomId}/playback`
6. **All clients receive action** and update their video players accordingly

**Participant Synchronization**
1. **New participant joins** the room
2. **Current playback state retrieved** from database
3. **Video player initialized** with current position and play/pause state
4. **Continuous synchronization** maintained through WebSocket messages

#### 5.4.4 Chat Functionality

1. **User types message** in chat input
2. **Frontend sends message** via WebSocket to `/app/room/{roomId}/chat`
3. **Backend receives message** and adds metadata (timestamp, sender info)
4. **Message broadcasted** to `/topic/room/{roomId}`
5. **All participants receive message** and display in chat interface
6. **Message types supported**:
   - CHAT: Regular chat messages
   - JOIN: User joined notification
   - LEAVE: User left notification

#### 5.4.5 WebRTC Video Streaming

**Peer Connection Setup**
1. **Participant A initiates connection** to Participant B
2. **Participant A creates offer** with SDP (Session Description Protocol)
3. **Offer sent via WebSocket** to `/app/room/{roomId}/webrtc/offer` with target participant ID
4. **Backend forwards offer** to Participant B via `/user/{participantB}/queue/room/{roomId}/webrtc/offer`
5. **Participant B creates answer** with SDP
6. **Answer sent back** via `/app/room/{roomId}/webrtc/answer`
7. **Backend forwards answer** to Participant A

**ICE Candidate Exchange**
1. **Participants gather ICE candidates** for NAT traversal
2. **Candidates sent via WebSocket** to `/app/room/{roomId}/webrtc/ice-candidate`
3. **Backend forwards candidates** to target participant
4. **Peer-to-peer connection established** once candidates exchanged
5. **Video streams transmitted** directly between peers

#### 5.4.6 Leaving a Room

1. **User closes room page** or navigates away
2. **Frontend sends LEAVE message** via WebSocket
3. **WebSocket connection closed**
4. **Other participants notified** of user departure
5. **If host leaves**, room remains active but playback control may transfer or room may close

---

## Chapter 6: Conclusion and Recommendations

### 6.1 Conclusion

The ForThePlot project successfully implements a comprehensive synchronized video streaming platform that addresses the growing demand for shared viewing experiences in the digital age. The application demonstrates the effective integration of modern web technologies to create a seamless, real-time collaborative environment for watching movies and TV shows together.

**Key Achievements:**

1. **Full-Stack Implementation**: The project showcases a complete full-stack application with a robust Spring Boot backend and a responsive React frontend, demonstrating proficiency in both server-side and client-side development.

2. **Real-Time Synchronization**: The implementation of WebSocket-based playback synchronization ensures that all participants in a room experience perfectly synchronized video playback, addressing one of the core challenges of shared viewing platforms.

3. **Scalable Architecture**: The layered architecture pattern employed in the backend, combined with component-based frontend design, provides a maintainable and scalable codebase that can accommodate future enhancements.

4. **Security Implementation**: JWT-based authentication, role-based access control, and secure WebSocket connections demonstrate a comprehensive approach to application security.

5. **Modern Development Practices**: The use of TypeScript for type safety, React Query for efficient data fetching, and Spring Data JPA for database abstraction reflects adherence to industry best practices.

6. **User Experience Focus**: The integration of a modern UI component library, responsive design, and real-time chat functionality creates an engaging and intuitive user experience.

The project successfully demonstrates the practical application of theoretical concepts learned throughout the course, including distributed systems, real-time communication protocols, RESTful API design, and modern frontend frameworks. The ForThePlot platform provides a solid foundation for a production-ready application while serving as an excellent learning experience in full-stack web development.

### 6.2 Recommendations

#### 6.2.1 Performance Optimization

**Media Delivery Enhancement**
- **Recommendation**: Implement a Content Delivery Network (CDN) for media file distribution to reduce latency and improve streaming performance for geographically distributed users.
- **Implementation**: Integrate with cloud storage services like AWS S3 or Google Cloud Storage, and use CDN services like CloudFront or Cloud CDN.
- **Expected Benefit**: Reduced server load, faster content delivery, and improved user experience especially for users far from the server location.

**Database Optimization**
- **Recommendation**: Implement database indexing on frequently queried fields (e.g., movie title, genre, release date) and consider implementing caching mechanisms using Redis or similar in-memory data stores.
- **Implementation**: Add database indexes in Flyway migration scripts, integrate Spring Cache with Redis for frequently accessed data like trending movies and room lists.
- **Expected Benefit**: Faster query response times, reduced database load, and improved application responsiveness.

**Frontend Performance**
- **Recommendation**: Implement code splitting and lazy loading for route components to reduce initial bundle size.
- **Implementation**: Use React.lazy() and Suspense for route-level code splitting, optimize images with modern formats (WebP), and implement virtual scrolling for long lists.
- **Expected Benefit**: Faster initial page load, reduced bandwidth consumption, and improved perceived performance.

#### 6.2.2 Feature Enhancements

**Advanced Room Features**
- **Recommendation**: Implement additional room management features such as:
  - Room moderation tools (kick/ban users, mute chat)
  - Scheduled watch parties with calendar integration
  - Room templates for recurring events
  - Participant video/audio chat alongside synchronized playback
- **Expected Benefit**: Enhanced user engagement, better control for room hosts, and more versatile use cases.

**Social Features**
- **Recommendation**: Add social networking capabilities:
  - User profiles with watch history and preferences
  - Friend system and social connections
  - Activity feed showing friends' watching activities
  - Movie/TV show ratings and reviews
  - Recommendation engine based on viewing history
- **Expected Benefit**: Increased user retention, community building, and personalized user experience.

**Mobile Application**
- **Recommendation**: Develop native mobile applications for iOS and Android using React Native or Flutter to provide a mobile-first experience.
- **Implementation**: Share business logic with the web application, optimize UI for mobile screens, implement push notifications for room invitations.
- **Expected Benefit**: Expanded user base, better mobile user experience, and increased accessibility.

#### 6.2.3 Scalability Improvements

**Microservices Architecture**
- **Recommendation**: As the application grows, consider migrating to a microservices architecture with separate services for:
  - Authentication and user management
  - Media catalog and metadata
  - Room management and synchronization
  - Media streaming and delivery
- **Implementation**: Use Spring Cloud for service discovery, API Gateway for routing, and message queues (RabbitMQ/Kafka) for inter-service communication.
- **Expected Benefit**: Independent scaling of services, improved fault isolation, and easier maintenance.

**Load Balancing and High Availability**
- **Recommendation**: Implement load balancing across multiple backend instances and ensure high availability through redundancy.
- **Implementation**: Use container orchestration (Kubernetes) for automatic scaling, implement health checks, and set up database replication.
- **Expected Benefit**: Improved reliability, better handling of traffic spikes, and minimal downtime.

#### 6.2.4 Monitoring and Analytics

**Application Monitoring**
- **Recommendation**: Implement comprehensive monitoring and logging solutions.
- **Implementation**: Integrate tools like Prometheus for metrics collection, Grafana for visualization, ELK stack (Elasticsearch, Logstash, Kibana) for log aggregation and analysis.
- **Expected Benefit**: Proactive issue detection, performance insights, and better debugging capabilities.

**User Analytics**
- **Recommendation**: Implement analytics to track user behavior and application usage.
- **Implementation**: Integrate Google Analytics or custom analytics solution to track page views, user flows, feature usage, and engagement metrics.
- **Expected Benefit**: Data-driven decision making for feature development and UX improvements.

#### 6.2.5 Security Enhancements

**Advanced Security Measures**
- **Recommendation**: Implement additional security features:
  - Two-factor authentication (2FA) for user accounts
  - Rate limiting to prevent API abuse
  - Content Security Policy (CSP) headers
  - Regular security audits and penetration testing
  - HTTPS enforcement with SSL/TLS certificates
- **Expected Benefit**: Enhanced security posture, protection against common vulnerabilities, and increased user trust.

**Content Protection**
- **Recommendation**: Implement Digital Rights Management (DRM) for copyrighted content protection.
- **Implementation**: Integrate with DRM solutions like Widevine or FairPlay for encrypted media streaming.
- **Expected Benefit**: Legal compliance, content creator protection, and ability to host premium content.

#### 6.2.6 Testing and Quality Assurance

**Automated Testing**
- **Recommendation**: Implement comprehensive automated testing strategy:
  - Unit tests for backend services and frontend components
  - Integration tests for API endpoints
  - End-to-end tests for critical user flows
  - Performance testing for load handling
- **Implementation**: Use JUnit and Mockito for backend testing, Jest and React Testing Library for frontend, Cypress for E2E tests.
- **Expected Benefit**: Reduced bugs in production, faster development cycles, and confidence in code changes.

**Continuous Integration/Continuous Deployment (CI/CD)**
- **Recommendation**: Set up automated CI/CD pipelines for testing and deployment.
- **Implementation**: Use GitHub Actions, GitLab CI, or Jenkins for automated builds, tests, and deployments to staging and production environments.
- **Expected Benefit**: Faster release cycles, reduced manual errors, and consistent deployment process.

#### 6.2.7 Accessibility and Internationalization

**Accessibility Compliance**
- **Recommendation**: Ensure the application meets WCAG 2.1 accessibility standards.
- **Implementation**: Add proper ARIA labels, keyboard navigation support, screen reader compatibility, and sufficient color contrast.
- **Expected Benefit**: Inclusive user experience, legal compliance, and expanded user base.

**Internationalization (i18n)**
- **Recommendation**: Implement multi-language support to reach a global audience.
- **Implementation**: Use i18next for React frontend, integrate translation management system, support RTL languages.
- **Expected Benefit**: Global market reach, localized user experience, and increased adoption in non-English speaking regions.

---

## Summary

The ForThePlot project represents a successful implementation of a modern, full-stack web application that combines real-time communication, media streaming, and social interaction. The recommendations provided offer a roadmap for evolving the platform from a proof-of-concept to a production-ready, scalable application capable of serving a large user base while maintaining high performance, security, and user satisfaction.

The modular architecture and adherence to best practices established in the current implementation provide a solid foundation for implementing these recommendations incrementally, allowing for continuous improvement and feature expansion based on user feedback and business requirements.
