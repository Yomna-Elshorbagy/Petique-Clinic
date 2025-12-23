# 🐾 Petique Clinic Management System

Petique Clinic is a full-stack veterinary clinic management platform designed to serve pet owners, doctors, administrators, and clinic owners.
The system manages reservations, vaccinations, services, and products through role-based access and multiple dashboards.

---

## 🚀 Project Overview

Petique Clinic enables:

- Easy appointment booking for pet owners
- Reservation and medical record management for doctors
- Product and service management for admins
- Full business control and analytics for owners
- Ai integration through ChatBot text prediction and image analyzing for pets disease 

The platform consists of **3 websites** and **4 user roles**.

---

## 👥 User Roles

### 🐶 Pet Owner

- Sign up & login 
- Google OAuth signup & login
- Email verification & OTP
- Forget & reset password
- Add and manage pets
- Book reservations (doctor, date, time, service)
- View reservation history
- Track vaccination records
- View & track orders
- Reservation & vaccination reminders
- Full notification system

### 👨‍⚕️ Doctor

- View assigned reservations
- Manage daily schedule
- Add vaccinations & medical notes
- Update reservation status
- Notifications for reservations & services

### 🛠️ Admin Shopping

- Manage users & product-related support emails
- Manage products & Categories & coupons & orders
- View analytics & reports 
- Order notifications

### 👑 Owner

- Full system access
- Manage admins & doctors
- Access all dashboards
- Monitor clinic performance

---

## 🌐 Websites

1. Pet Owner Website
2. Doctor Reservation Dashboard
3. Admin Shopping Dashboard
4. Owner Super Admin Full Access

---

## 📅 Reservation Workflow

PENDING → CONFIRMED → COMPLETED  
CANCELED

---

## 💉 Vaccination Management

- Linked to pet, doctor, and reservation
- Editable by doctors
- Viewable by pet owners
- Auditable by owner
- managed by status
- automatic calculated nex does and sending reminders mails

---

## 🛠️ Tech Stack

### Frontend

- React / React Native
- TypeScript
- Redux Toolkit
- React Query
- Zod
- i18next
- Tailwind CSS

### Backend

- Node.js
- Express.js
- Mongo Atlas + Mongoose
- JWT Authentication
- Role-based authorization
- Cloudinary (images)
- Stripe (payments)
- Notification management system

---

## 🔄 Application Workflow & Architecture

### API-Driven Design

- RESTful APIs
- Role-based access control
- Pagination & filtering
- Soft delete strategy
- Centralized error handling

### State Management

- Redux Toolkit for global state:
  - Auth
  - Cart & orders
  - Notifications
  - UI state

### Server State

- React Query for:
  - Data fetching
  - Caching
  - Background refetching
  - Optimistic updates

---

## 🪝 Custom Hooks for APIs

Reusable hooks wrap API logic:

- useGetReservations
- useAddReservation
- useUpdateReservation
- useGetOrders
- useGetProducts
- and more ....

Benefits:

- Clean components
- Reusable logic
- Type-safe APIs

---

## 📄 Pagination & Filtering

Implemented for:

- Reservations
- Orders
- Products
- Users

Handled using:

- Backend query params
- Reusable pagination component
- Cached query states

---

## 🧩 Shared Components

Reusable UI components across all dashboards:

- StatCard
- Tables
- Modals
- Forms (Zod validation)
- Badges & buttons
- Loaders & empty states

---

## 🔔 Notifications System

- Reservation reminders
- Vaccination reminders
- Order updates
- Doctor schedule alerts

Channels:

- In-app notifications
- Email notifications

---

## 📁 Project Structure

```text
petique-clinic/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   └── utils/
│
├── pet-owner-frontend/
├── doctor-dashboard/
├── admin-shopping-dashboard/
└── README.md
```
---
## 🐾 Petique Clinic

Smart Care for Every Pet
