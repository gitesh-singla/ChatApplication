# Chat Application

This repository contains a chat application built using Next.js and a Node.js service that hosts a WebSocket (WS) server. The application uses Prisma ORM with PostgreSQL and NextAuth for authentication (both credentials and OAuth). It allows users to add friends and chat with them. The socket connections are secured with a separate JWT token issued on the Next.js server and verified on the socket server.

## Project Overview

### Features

- **User Authentication**: Supports both credentials and OAuth through NextAuth.
- **Friend Management**: Allows users to add friends.
- **Real-time Chat**: Users can chat with their friends in real-time using WebSockets.
- **JWT Security**: Socket connections are secured using JWT tokens.

## Setup Guidelines

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/chat-application.git
    cd chat-application
    ```

2. Install dependencies for both `chat-app` and `socket-server`:

    ```bash
    cd chat-app
    npm install

    cd ../socket-server
    npm install
    ```

### Configuration

1. Fill in the `.env` files in both `chat-app` and `socket-server` folders according to the `.env.example` files provided.

2. Generate Prisma client:

    ```bash
    cd chat-app
    npx prisma generate

    cd ../socket-server
    npx prisma generate
    ```

### Running the Application

1. **Start the chat application**:

    ```bash
    cd chat-app
    npm run dev
    ```

2. **Start the socket server**:

    ```bash
    cd socket-server
    tsc
    node dist/index.js
    ```

## License

This project is licensed under the MIT License.

## Contact

giteshsingla7@gmail.com.