EMCP Baseline NestJS Backend

A production‑ready NestJS backend service with Docker, Docker Compose

Description
-----------

This project is a baseline NestJS backend service designed for cloud‑native environments. It provides a solid starting point that includes:

*   A modular, TypeScript‑based NestJS server
    
*   Docker and Docker Compose configuration for local development
    

Prerequisites
-------------

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
    
*   [Docker](https://www.docker.com/)
    
*   [Docker Compose](https://docs.docker.com/compose/)
    

Developer Home Test 🚀
----------------------

**Welcome new developers!** Complete this ping-pong service challenge to demonstrate your understanding of the tech stack.

### Challenge Overview

Build a real-time ping-pong service that demonstrates:

*   RESTful API endpoints
    
*   Redis streams for message queuing
    
*   WebSocket connections for real-time communication
    
*   Client-side real-time updates
    

### Requirements

#### Backend Implementation

1.  **Ping Endpoint**: Create a POST endpoint /api/ping that:
    
    *   Accepts a "ping" message from clients
        
    *   Writes the message to a Redis stream
        
    *   Returns acknowledgment to the client
        
2.  **Redis Stream Processing**: Implement a background service that:
    
    *   Listens to the Redis stream for new ping messages
        
    *   Processes each message and transforms it to "pong"
        
    *   Broadcasts the "pong" message to all connected WebSocket clients
        
3.  **WebSocket Gateway**: Create a WebSocket gateway that:
    
    *   Accepts client connections
        
    *   Broadcasts "pong" messages to all connected clients
        
    *   Handles client connect/disconnect events
        

#### Frontend Implementation

1.  **Client Application**: Build a simple client (React preferred) that:
    
    *   Has a button to send "ping" requests to the server
        
    *   Connects to the WebSocket to receive "pong" messages
        
    *   Displays received "pong" messages in real-time
        
    

### Technical Requirements

*   **Local Development Only**: No need for multi-node considerations
    
*   **Docker Compose**: All services must run via docker-compose up
    
*   **Dependencies**: Include Redis in your docker-compose setup
    
*   **Real-time**: Use WebSockets for client-server communication
    
*   **Message Queue**: Use Redis streams (not pub/sub)
    

### Evaluation Criteria

*   ✅ Code quality and organization
    
*   ✅ Proper error handling
    
*   ✅ Docker setup works out of the box
    
*   ✅ Real-time functionality works as described
    
*   ✅ Clean and intuitive client interface
    
*   ✅ Documentation and comments
    

### Deliverables

1.  Updated NestJS backend with ping-pong service
    
2.  Client application (React or any framework)
    
3.  Updated docker-compose.yml with Redis
    
4.  Brief documentation explaining your implementation choices
    

Submission
------------

1.  Click on "Use this template" to create a new repository
    
3.  Commit your changes 
    
4.  Push your changes to your new repository

6.  Send an email - itzhak@enclaive.io with a link
    

Support
-------

If you encounter issues during the home test or have questions about the setup, please:

1.  Email - itzhak@enclaive.io
    
2. Feel free to use any AI, but do not share the entire repo with AI
    

**Good luck with the home test! Happy hacking 🎯**