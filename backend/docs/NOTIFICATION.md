# Notification Module Documentation

> **Ngày tạo**: 15/06/2026  
> **Phiên bản**: 1.0  
> **Trạng thái**: ✅ Implemented — Sẵn sàng sử dụng

---

## 📋 Tổng quan

Module Notification cung cấp hệ thống thông báo **đa năng** cho ứng dụng mini-ecommerce, được thiết kế để phục vụ:

| Đối tượng | Mục đích | Ví dụ |
|-----------|----------|-------|
| **Admin** | Nhận yêu cầu từ vendor | Duyệt sản phẩm, yêu cầu rút tiền |
| **User** | Nhận thông tin từ vendor theo dõi | Sản phẩm mới, khuyến mãi |
| **Tất cả** | Thông báo hệ thống & đơn hàng | Cập nhật trạng thái đơn hàng, bảo trì hệ thống |

---

## 🗂️ Cấu trúc Module

```
src/modules/notification/
├── index.ts                      # Public exports
├── notification.types.ts         # Zod schemas + DTOs
├── notification.service.ts       # Business logic
├── notification.controller.ts    # HTTP request handlers
└── notification.routes.ts        # Route definitions
```

---

## 🗄️ Database Schema

### Enum: `NotificationType`

```prisma
enum NotificationType {
  // --- Admin notifications (nhận từ vendor) ---
  VENDOR_REQUEST        // Vendor gửi yêu cầu chung
  VENDOR_PRODUCT_REVIEW // Vendor yêu cầu duyệt sản phẩm
  VENDOR_WITHDRAWAL     // Vendor yêu cầu rút tiền

  // --- User notifications (từ vendor mà user theo dõi) ---
  NEW_PRODUCT           // Sản phẩm mới từ vendor theo dõi
  PRODUCT_PROMOTION     // Khuyến mãi sản phẩm

  // --- Shared (dùng chung cho mọi role) ---
  ORDER_STATUS          // Cập nhật trạng thái đơn hàng
  SYSTEM                // Thông báo từ hệ thống
}
```

### Model: `Notification`

| Field | Type | Mô tả |
|-------|------|--------|
| `id` | `String (UUID)` | Khóa chính |
| `userId` | `String (UUID)` | FK → User. Người nhận thông báo |
| `type` | `NotificationType` | Phân loại thông báo |
| `title` | `String` | Tiêu đề ngắn gọn (hiển thị trên badge/list) |
| `message` | `String (Text)` | Nội dung chi tiết |
| `referenceId` | `String? (UUID)` | ID entity liên quan (polymorphic) |
| `referenceType` | `String?` | Loại entity: `"product"`, `"order"`, `"vendor_request"`... |
| `isRead` | `Boolean` | Trạng thái đã đọc (default: `false`) |
| `readAt` | `DateTime?` | Thời điểm đọc |
| `createdAt` | `DateTime` | Thời điểm tạo |

### Indexes

| Index | Mục đích |
|-------|----------|
| `[userId, isRead]` | Query nhanh: lấy thông báo chưa đọc của user |
| `[userId, createdAt]` | Query nhanh: phân trang theo thời gian |
| `[type]` | Query nhanh: lọc theo loại thông báo |

### Polymorphic Reference Pattern

Thay vì tạo FK cứng cho từng loại entity, dùng cặp `referenceId` + `referenceType`:

```
referenceId = "550e8400-e29b-...", referenceType = "product"   → Product
referenceId = "6ba7b810-9dad-...", referenceType = "order"     → Order
referenceId = "f47ac10b-58cc-...", referenceType = "vendor_request" → Vendor Request (tương lai)
```

**Ưu điểm**: Dễ mở rộng, không cần migration khi thêm entity mới.  
**Nhược điểm**: Không có FK constraint ở DB level — cần validate ở application level.

---

## 🔌 API Endpoints

Tất cả endpoints yêu cầu **authentication** (`authMiddleware`).

### `GET /api/notifications`

Lấy danh sách thông báo của user hiện tại.

**Query Parameters:**

| Param | Type | Default | Mô tả |
|-------|------|---------|--------|
| `page` | `number` | `1` | Trang hiện tại |
| `limit` | `number` | `20` | Số item/trang |
| `type` | `NotificationType` | — | Filter theo loại |
| `isRead` | `"true" \| "false"` | — | Filter theo trạng thái đọc |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "ORDER_STATUS",
      "title": "Đơn hàng đã được giao",
      "message": "Đơn hàng #123 đã được giao thành công.",
      "referenceId": "order-uuid",
      "referenceType": "order",
      "isRead": false,
      "createdAt": "2026-06-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### `GET /api/notifications/unread-count`

Lấy số thông báo chưa đọc (dùng cho badge count).

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

### `PATCH /api/notifications/:id/read`

Đánh dấu 1 thông báo đã đọc. **Idempotent** — gọi nhiều lần không ảnh hưởng.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "isRead": true,
    "readAt": "2026-06-15T10:05:00.000Z"
  }
}
```

---

### `PATCH /api/notifications/read-all`

Đánh dấu tất cả thông báo chưa đọc thành đã đọc.

**Response:**
```json
{
  "success": true,
  "data": {
    "updatedCount": 12
  }
}
```

---

### `DELETE /api/notifications/:id`

Xóa 1 thông báo (hard delete). Chỉ user sở hữu mới có quyền xóa.

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## 🔗 Cách sử dụng từ module khác

Module notification cung cấp `NotificationService.createNotification()` để các module khác tạo thông báo:

```typescript
import { NotificationService } from "../notification";

const notificationService = new NotificationService();

// Khi đơn hàng thay đổi trạng thái → thông báo cho user
await notificationService.createNotification({
  userId: order.userId,
  type: "ORDER_STATUS",
  title: "Đơn hàng đã được giao",
  message: `Đơn hàng #${order.id} đã được giao thành công.`,
  referenceId: order.id,
  referenceType: "order",
});

// Khi vendor gửi yêu cầu duyệt sản phẩm → thông báo cho admin
await notificationService.createNotification({
  userId: adminId,
  type: "VENDOR_PRODUCT_REVIEW",
  title: "Yêu cầu duyệt sản phẩm mới",
  message: `Vendor "${vendorName}" yêu cầu duyệt sản phẩm "${productName}".`,
  referenceId: productId,
  referenceType: "product",
});
```

---

## 📊 Trạng thái hiện tại

### ✅ Đã hoàn thành

- [x] Prisma schema: enum `NotificationType` + model `Notification`
- [x] Database indexes cho performance
- [x] Module structure: types, service, controller, routes, index
- [x] CRUD operations: list, create, delete
- [x] Mark as read: single + mark all
- [x] Unread count cho badge UI
- [x] Phân trang & filter (type, isRead)
- [x] Polymorphic reference (referenceId + referenceType)
- [x] Validation với Zod schemas
- [x] Route registration trong app.ts
- [x] Database migration

### 🔲 Chưa triển khai (dành cho cải tiến)

- [ ] **Real-time notifications** (WebSocket / SSE) — hiện tại chỉ polling qua REST API
- [ ] **Batch create** — tạo thông báo cho nhiều user cùng lúc (VD: thông báo cho tất cả follower)
- [ ] **Notification preferences** — user tùy chỉnh nhận/tắt loại thông báo nào
- [ ] **Email/Push notification** — gửi thông báo qua email hoặc push notification ngoài in-app
- [ ] **Auto-cleanup** — xóa tự động thông báo cũ (VD: > 90 ngày)
- [ ] **Admin endpoint tạo thông báo** — hiện tại chỉ có internal method, chưa có REST endpoint cho admin
- [ ] **Soft delete** — hiện dùng hard delete, có thể đổi sang soft delete nếu cần lịch sử
- [ ] **Role VENDOR** — chưa thêm vào enum Role, sẽ làm khi triển khai web vendor

---

## 🔮 Hướng cải tiến đề xuất

### 1. Real-time Notifications (Ưu tiên cao)
Chuyển từ REST polling sang WebSocket/SSE để user nhận thông báo tức thì:
```
Client ←── WebSocket ←── Server (emit khi có notification mới)
```

### 2. Notification Preferences
Tạo bảng `NotificationPreference`:
```prisma
model NotificationPreference {
  id     String           @id @default(uuid())
  userId String
  type   NotificationType
  email  Boolean          @default(true)
  push   Boolean          @default(true)
  inApp  Boolean          @default(true)
  user   User             @relation(...)
  @@unique([userId, type])
}
```

### 3. Batch Notifications
Khi vendor tạo sản phẩm mới, cần thông báo cho tất cả follower:
```typescript
// Tương lai: NotificationService.createBatchNotifications()
await notificationService.createBatchNotifications({
  userIds: followerIds,  // Array of user IDs
  type: "NEW_PRODUCT",
  title: "Sản phẩm mới từ VendorX",
  message: "...",
  referenceId: productId,
  referenceType: "product",
});
```

### 4. Auto-cleanup Cron Job
Xóa thông báo cũ đã đọc để giữ database gọn:
```typescript
// Chạy hàng ngày
await prisma.notification.deleteMany({
  where: {
    isRead: true,
    createdAt: { lt: subDays(new Date(), 90) },
  },
});
```

---

## 📎 Files liên quan

| File | Mô tả |
|------|--------|
| `prisma/schema.prisma` | Schema definition (NotificationType + Notification) |
| `src/modules/notification/notification.types.ts` | Zod schemas + DTOs |
| `src/modules/notification/notification.service.ts` | Business logic |
| `src/modules/notification/notification.controller.ts` | HTTP handlers |
| `src/modules/notification/notification.routes.ts` | Route definitions |
| `src/modules/notification/index.ts` | Module exports |
| `src/app.ts` | Route registration |
