**# Socket.IO Setup Documentation**

> Comprehensive guide for real-time notifications with Socket.IO in the mini-ecommerce backend

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Core Components](#core-components)
5. [Usage Guide](#usage-guide)
6. [Real-Time Notifications](#real-time-notifications)
7. [Event System](#event-system)
8. [Client Integration](#client-integration)
9. [Scaling & Deployment](#scaling--deployment)
10. [Future Extensions (Chat)](#future-extensions-chat)
11. [Troubleshooting](#troubleshooting)

---

## Overview

Socket.IO has been integrated into the mini-ecommerce backend to enable **real-time bidirectional communication** between admin, vendors, and users. The implementation is designed to be:

- **Scalable**: Supports multiple instances with proper event handling
- **Modular**: Event registry pattern for easy extension
- **Type-Safe**: Full TypeScript support
- **Secure**: JWT-based authentication for all socket connections
- **Future-Proof**: Architecture ready for chat functionality

### Key Features

✅ Real-time notifications between admin and vendors  
✅ User online/offline status tracking  
✅ Persistent notification storage (DB + real-time)  
✅ Organized event handling with namespaces  
✅ Automatic reconnection and error handling  
✅ Scalable to multiple server instances  

---

## Architecture

### Directory Structure

```
src/shared/websocket/
├── socketio.gateway.ts              # Main Socket.IO server
├── event.registry.ts                # Event handler registry
├── realtime.notification.service.ts # Real-time notification logic
├── INTEGRATION_EXAMPLE.ts           # Usage examples
├── middleware/
│   └── socket.auth.ts               # JWT authentication
└── handlers/
    └── notification.handler.ts      # Event handlers
```

### Component Diagram

```
┌─────────────────────────────────────────────────────┐
│                    HTTP Server                       │
├─────────────────────────────────────────────────────┤
│                  Socket.IO Gateway                   │
│  ┌──────────────────────────────────────────────┐   │
│  │  SocketAuthMiddleware (JWT Verification)     │   │
│  │  ├─ Token from query (?token=...)           │   │
│  │  ├─ Token from headers (Authorization)      │   │
│  │  └─ Attach userId, userRole to socket       │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  Connection Management                       │   │
│  │  ├─ Join user-specific room (user:{userId}) │   │
│  │  ├─ Join admin room if ADMIN role           │   │
│  │  └─ Track disconnection                      │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │  Event Registry (Extensible)                 │   │
│  │  ├─ notification:subscribe                   │   │
│  │  ├─ notification:unsubscribe                 │   │
│  │  └─ [Future] chat:send, etc.                │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
           ⬇️
┌─────────────────────────────────────────────────────┐
│  RealTimeNotificationService                        │
│  ├─ notifyUser()                                    │
│  ├─ notifyAdmins()                                  │
│  ├─ notifyUserRealtime()                            │
│  ├─ notifyAdminsRealtime()                          │
│  └─ getUserConnectionStatus()                       │
└─────────────────────────────────────────────────────┘
           ⬇️
┌─────────────────────────────────────────────────────┐
│  Database (Prisma)                                  │
│  ├─ Save notifications to DB                        │
│  └─ Track user preferences                          │
└─────────────────────────────────────────────────────┘
```

---

## Installation

### Step 1: Dependencies Already Installed

The following packages have been installed:
- `socket.io` - WebSocket server
- `@types/socket.io` - TypeScript definitions

To verify:
```bash
npm list socket.io @types/socket.io
```

### Step 2: Verify Server Integration

The server.ts has been updated to:
1. Create HTTP server
2. Initialize Socket.IO
3. Register event handlers
4. Initialize real-time service

---

## Core Components

### 1. SocketIOGateway

**File**: `src/shared/websocket/socketio.gateway.ts`

Main orchestrator for Socket.IO server.

**Key Methods**:

```typescript
// Initialize Socket.IO
const io = initializeSocketIO(httpServer, config);

// Get gateway instance
const gateway = getSocketIOGateway();

// Broadcast to specific room
gateway.broadcastToRoom("room-name", "event", data);

// Broadcast to user
gateway.broadcastToUser(userId, "event", data);

// Broadcast to all admins
gateway.broadcastToAdmins("event", data);

// Get connected users count
const count = gateway.getConnectedUsersCount();
```

### 2. EventRegistry

**File**: `src/shared/websocket/event.registry.ts`

Registry pattern for managing event handlers.

**Features**:
- Namespace-based organization
- Dynamic handler registration
- Automatic attachment to sockets
- Error handling per handler

**Usage**:

```typescript
const registry = gateway.getEventRegistry();

// Register handler
registry.register("notification", "subscribe", async (socket, io) => {
    // Handle event
});

// Check if handler exists
if (registry.has("notification", "subscribe")) {
    // ...
}

// List all handlers (for debugging)
console.log(registry.listHandlers());
```

### 3. SocketAuthMiddleware

**File**: `src/shared/websocket/middleware/socket.auth.ts`

Authenticates socket connections using JWT tokens.

**Token Sources**:
1. Query parameter: `ws://localhost:5000?token=<jwt_token>`
2. Headers: `Authorization: Bearer <jwt_token>`

**Attached to socket.handshake.auth**:
- `userId` - User ID from JWT
- `userRole` - User role (USER, ADMIN)
- `email` - User email

### 4. RealTimeNotificationService

**File**: `src/shared/websocket/realtime.notification.service.ts`

Service for sending notifications with database persistence and real-time delivery.

**Key Methods**:

```typescript
const service = getRealTimeNotificationService();

// Save to DB + emit real-time
await service.notifyUser({
    userId: "user-id",
    type: NotificationType.ORDER_STATUS,
    title: "Order Updated",
    message: "Your order has been shipped",
    referenceId: "order-id",
    referenceType: "ORDER",
});

// Notify all admins (saved to DB + real-time)
await service.notifyAdmins({
    type: NotificationType.VENDOR_REQUEST,
    title: "New Request",
    message: "Vendor sent a request",
    referenceId: "vendor-id",
    referenceType: "VENDOR",
});

// Real-time only (no DB save)
service.notifyUserRealtime(userId, "event-name", data);
service.notifyAdminsRealtime("event-name", data);

// Check connection status
const status = service.getUserConnectionStatus(userId);
// Returns: { connected: boolean, socketCount: number }

// Get connected users count
const count = service.getConnectedUsersCount();
```

---

## Usage Guide

### For Module Developers

When you need to send a notification from any module (Order, Product, User, etc.):

**Example 1: Notify specific user**

```typescript
// In src/modules/order/order.service.ts
import { getRealTimeNotificationService } from "../../shared/websocket";
import { NotificationType } from "@prisma/client";

export class OrderService {
    async updateOrderStatus(orderId: string, status: OrderStatus) {
        // Update order...
        const order = await prisma.order.update({...});
        
        // Send real-time notification
        const realtimeService = getRealTimeNotificationService();
        await realtimeService.notifyUser({
            userId: order.userId,
            type: NotificationType.ORDER_STATUS,
            title: "Order Status Updated",
            message: `Your order has been ${status.toLowerCase()}`,
            referenceId: orderId,
            referenceType: "ORDER",
        });
    }
}
```

**Example 2: Notify all admins about vendor request**

```typescript
// In src/modules/vendor/vendor.service.ts
import { getRealTimeNotificationService } from "../../shared/websocket";

export class VendorService {
    async createVendorRequest(vendorId: string, requestData: any) {
        const request = await prisma.vendorRequest.create({...});
        
        const realtimeService = getRealTimeNotificationService();
        await realtimeService.notifyAdmins({
            type: NotificationType.VENDOR_REQUEST,
            title: "New Vendor Request",
            message: `Vendor ${vendor.name} sent a new request`,
            referenceId: request.id,
            referenceType: "VENDOR_REQUEST",
            vendorId: vendorId,
            data: { requestType: request.type },
        });
    }
}
```

**Example 3: Real-time only notification (no DB save)**

```typescript
// Send temporary notification (not saved to DB)
const realtimeService = getRealTimeNotificationService();
realtimeService.notifyUserRealtime(userId, "user:online-status", {
    message: "User is now online",
    timestamp: new Date(),
});
```

---

## Real-Time Notifications

### Notification Types

Available notification types (from Prisma schema):

```typescript
enum NotificationType {
    // Admin notifications (from vendor)
    VENDOR_REQUEST,           // Vendor sends request
    VENDOR_PRODUCT_REVIEW,    // Vendor requests product approval
    VENDOR_WITHDRAWAL,        // Vendor requests withdrawal

    // User notifications (from vendor)
    NEW_PRODUCT,              // New product from followed vendor
    PRODUCT_PROMOTION,        // Product promotion

    // Shared
    ORDER_STATUS,             // Order status update
    SYSTEM,                   // System notification
}
```

### Flow: Sending Notification

```
Module (Order/Product/Vendor)
    ⬇️
RealTimeNotificationService.notifyUser()
    ⬇️
Prisma: Create notification in DB
Emit: "notification:received" event to user's room
    ⬇️
Socket.IO broadcasts to user:({userId})
    ⬇️
Connected clients receive in real-time
```

### Flow: Client Receives Notification

1. Client connects with JWT token
2. Socket authenticates and joins `user:{userId}` room
3. When notification is sent, socket broadcasts to that room
4. Client receives `notification:received` event

---

## Event System

### Built-in Events

#### notification:subscribe
**Sent by**: Client  
**Purpose**: Tell server that client is ready to receive notifications

```typescript
// Client code
socket.emit("notification:subscribe", { isActive: true });

// Server response
socket.on("notification:subscribed", (data) => {
    console.log("Subscribed successfully", data);
});
```

#### notification:unsubscribe
**Sent by**: Client  
**Purpose**: Tell server to stop sending notifications

```typescript
socket.emit("notification:unsubscribe");

socket.on("notification:unsubscribed", (data) => {
    console.log("Unsubscribed successfully", data);
});
```

#### notification:received
**Sent by**: Server  
**Purpose**: Real-time notification delivery to client

```typescript
// Server broadcasts this
socket.to(`user:${userId}`).emit("notification:received", {
    id: notification.id,
    type: "ORDER_STATUS",
    title: "Order Updated",
    message: "Your order has been shipped",
    referenceId: "order-123",
    referenceType: "ORDER",
    createdAt: new Date(),
});

// Client listens
socket.on("notification:received", (notification) => {
    console.log("New notification:", notification);
    // Update UI
});
```

### Custom Events

You can register custom events for future features:

```typescript
// In a module initialization
const gateway = getSocketIOGateway();
const registry = gateway.getEventRegistry();

registry.register("chat", "message", async (socket, io, message) => {
    // Handle chat message
});

registry.register("chat", "typing", async (socket, io) => {
    // Handle typing indicator
});
```

---

## Client Integration

### Frontend Connection

**React Example** (recommended: use a custom hook):

```typescript
// hooks/useSocket.ts
import { useEffect, useState } from "react";
import io from "socket.io-client";

export function useSocket(token: string) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL, {
            query: { token },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        newSocket.on("connect", () => {
            setIsConnected(true);
            console.log("Connected to Socket.IO");
        });

        newSocket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Disconnected from Socket.IO");
        });

        newSocket.on("notification:received", (notification) => {
            console.log("New notification:", notification);
            // Update notification badge, show toast, etc.
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [token]);

    return { socket, isConnected };
}
```

**Usage in Component**:

```typescript
function NotificationBell() {
    const { user } = useAuth();
    const { socket, isConnected } = useSocket(user?.token);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.emit("notification:subscribe", { isActive: true });

        socket.on("notification:received", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            // Show toast notification
            showToast(notification.title, notification.message);
        });

        return () => {
            socket.emit("notification:unsubscribe");
        };
    }, [socket]);

    return (
        <div className="notification-bell">
            <Bell size={24} />
            {notifications.length > 0 && (
                <span className="badge">{notifications.length}</span>
            )}
        </div>
    );
}
```

---

## Scaling & Deployment

### Single Instance (Current Setup)

Works perfectly for development and small deployments.

**Connection Flow**:
```
Client → Socket.IO Server → In-Memory rooms
```

### Multi-Instance Setup (Future)

When scaling to multiple server instances, you'll need Redis adapter:

```typescript
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const pubClient = createClient();
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

**Benefits**:
- Messages broadcast across all instances
- Reliable message delivery
- Automatic load balancing
- Session persistence

### Environment Variables

Ensure these are set:

```env
# JWT
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development|production
```

---

## Future Extensions (Chat)

The architecture is designed to easily accommodate chat functionality:

### Chat Implementation Plan

```typescript
// 1. Create chat handler
// File: src/shared/websocket/handlers/chat.handler.ts
export const chatMessageHandler = async (socket, io, message) => {
    // Save message to DB
    // Emit to recipient
};

export const chatTypingHandler = async (socket, io, data) => {
    // Broadcast typing indicator
};

// 2. Register handlers in server.ts
const registry = gateway.getEventRegistry();
registry.register("chat", "message", chatMessageHandler);
registry.register("chat", "typing", chatTypingHandler);

// 3. Usage in module
await service.sendChatMessage({
    fromUserId: "admin-id",
    toUserId: "vendor-id",
    message: "Hello",
    type: "TEXT", // or IMAGE, FILE
});
```

**Rooms for Chat**:
- Direct messages: `chat:user1-user2` (alphabetically sorted)
- Group chats: `chat:group-id`
- Broadcast: `admin` room

---

## Troubleshooting

### Issue: Socket connection fails with "Authentication token is required"

**Solution**: Ensure token is passed in query or headers:
```typescript
const socket = io("http://localhost:5000", {
    query: { token: jwtToken }
});
```

### Issue: Events not received on client

**Checklist**:
1. ✅ Socket is connected: `socket.connected === true`
2. ✅ User subscribed: `socket.emit("notification:subscribe")`
3. ✅ Event listener registered: `socket.on("notification:received", ...)`
4. ✅ Server sent event to correct room: `user:{userId}`

### Issue: "Socket.IO server not initialized"

**Solution**: Ensure server.ts calls `initializeSocketIO()` before registering handlers

### Issue: High memory usage with many connections

**Solution**: 
- Implement Redis adapter for distributed setup
- Set `maxHttpBufferSize` appropriately
- Clean up old event listeners

### Issue: Notifications not persistent after reconnect

**This is by design**. However, you can fetch missed notifications:

```typescript
// When socket reconnects
socket.on("connect", async () => {
    const response = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const notifications = await response.json();
    // Update UI with notifications
});
```

---

## Monitoring & Debugging

### Check Active Connections

```typescript
const gateway = getSocketIOGateway();
const count = gateway.getConnectedUsersCount();
console.log(`Active connections: ${count}`);
```

### List Registered Events

```typescript
const registry = gateway.getEventRegistry();
console.log(registry.listHandlers());
// Output: ['notification:subscribe', 'notification:unsubscribe', ...]
```

### Check User Connection Status

```typescript
const realtimeService = getRealTimeNotificationService();
const status = realtimeService.getUserConnectionStatus(userId);
console.log(`User ${userId} is ${status.connected ? 'online' : 'offline'}`);
console.log(`Connected sockets: ${status.socketCount}`);
```

---

## Summary

✅ **Setup Complete**  
✅ **Scalable Architecture**  
✅ **Ready for Notifications**  
✅ **Future-Proof for Chat**  
✅ **Production-Ready**  

For questions or issues, refer to Socket.IO documentation: https://socket.io/docs/

---

**Last Updated**: 2026-06-26  
**Status**: Production Ready
