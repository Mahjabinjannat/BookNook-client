
# 📚 BookNook

### Your Digital Bookshelf, Reimagined

**BookNook** is a modern, responsive, full-stack library management application that makes discovering, managing, borrowing, and returning books simple and enjoyable.

Built with **Next.js 16, React, TypeScript, Express.js, MongoDB, and Better Auth**, BookNook combines an elegant user interface with secure authentication, personalized book management, and a convenient borrowing system.

> 📖 Explore books. Build your collection. Borrow with ease.

---

## 🌐 Live Links

| Resource | Link |
|----------|------|
| 🌍 Live Website | [Visit BookNook](https://booknookclient.vercel.app/) |
| 💻 Frontend Repository | [GitHub Frontend](https://github.com/Mahjabinjannat/BookNook-client) |
| ⚙️ Backend Repository | [GitHub Backend](https://github.com/Mahjabinjannat/BookNook-server) |

---

## ✨ Key Features

### 📖 Book Discovery

- Browse books through a beautiful, responsive interface.
- Explore newly added books.
- View detailed information about individual books.
- Discover available books in the library.
- Navigate seamlessly between book collections and details.

### 📚 Personal Book Management

- Add new books to the library.
- View personally added books in the **My Books** dashboard.
- Update existing book information.
- Delete books from your collection.
- Manage books through a responsive table interface.
- Access personalized book-management features after authentication.

### 🔖 Borrow & Return System

- Borrow available books using an authenticated account.
- View active borrowings in the **My Borrows** dashboard.
- Track borrowing dates and expected return dates.
- Identify overdue books through visual status indicators.
- Return borrowed books using a confirmation dialog.
- Update the borrowing interface after successful returns.
- Check borrowing status before attempting another borrow.

### 🔐 Authentication & Authorization

- User registration and login using **Better Auth**.
- JWT-based authentication for protected backend endpoints.
- JWT signature verification using **JWKS** and `jose`.
- Server-side authentication checks for protected pages.
- Centralized authenticated API requests.
- User-specific book and borrowing operations.
- Automatic redirection to the sign-in page for unauthenticated users.

### 🎨 Modern User Interface

- Fully responsive design for mobile, tablet, and desktop.
- Elegant green-themed interface.
- Reusable UI components using **shadcn/ui**.
- Beautiful book cards and organized tables.
- Interactive confirmation dialogs.
- Loading skeletons for asynchronous content.
- Toast notifications using **Sonner**.
- User-friendly empty states and error messages.
- Icons powered by **Lucide React**.

---

## 🛠️ Technologies Used

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework and routing |
| React | Component-based user interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Responsive styling |
| shadcn/ui | Reusable UI components |
| Lucide React | Icons |
| Sonner | Toast notifications |
| Better Auth | Authentication and session management |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | REST API development |
| MongoDB | Database |
| jose | JWT verification |
| JWKS | Public-key-based JWT signature verification |
| CORS | Cross-origin request configuration |

### Development & Deployment

- Git and GitHub
- Visual Studio Code
- npm
- Vercel-compatible deployment

---

## 🏗️ Application Architecture

BookNook uses a separated frontend and backend architecture.

```text
                     ┌───────────────────────┐
                     │       BookNook        │
                     │     Next.js 16        │
                     │   React + TypeScript  │
                     └───────────┬───────────┘
                                 │
                     ┌───────────▼───────────┐
                     │      Better Auth      │
                     │ Authentication & JWT  │
                     └───────────┬───────────┘
                                 │
                          Bearer JWT
                                 │
                     ┌───────────▼───────────┐
                     │      Express API      │
                     │    JWT Verification   │
                     │   Protected Routes    │
                     └───────────┬───────────┘
                                 │
                     ┌───────────▼───────────┐
                     │        MongoDB        │
                     │ Books and Borrowings  │
                     └───────────────────────┘
```

### How It Works

1. Users access BookNook through the Next.js frontend.
2. Better Auth manages user authentication and sessions.
3. The frontend obtains a JWT for authenticated API requests.
4. The Express backend verifies the JWT using the Better Auth JWKS endpoint.
5. Protected API routes use the verified user identity.
6. MongoDB stores and retrieves book and borrowing information.
7. The frontend displays the API responses through responsive components.

---

## 📸 Project Screenshots

Add screenshots of your application inside an `images` directory in the repository.

### 🏠 Home Page

![BookNook Home Page](./assets/home.png)

### 📚 All Books

![All Books](./assets/all_books.png)

### 📖 Book Details

![Book Details](./assets/book-details.png)

### ➕ Add Book

![Add Book](./assets/add_books.png)

### 📋 My Books

![My Books](./assets/my_books.png)

### 🔖 My Borrows

![My Borrows](./assets/my-borrows.png)

> **Note:** Replace these screenshot paths with your actual screenshots before publishing.

---

## 📁 Project Structure

### Frontend

The following illustrates the main frontend modules.

```text
booknook-frontend/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── api/
│   │   ├── books/
│   │   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── add-book/
│   │   ├── my-books/
│   │   ├── my-borrows/
│   │   ├── signIn/
│   │   ├── signUp/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── books/
│   │   │   ├── BookDetails.tsx
│   │   │   ├── AddBookForm.tsx
│   │   │   ├── MyBooksTable.tsx
│   │   │   ├── MyBorrowsTable.tsx
│   │   │   └── BorrowBookDialog.tsx
│   │   │
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── api-client.ts
│   │   ├── book-api.ts
│   │   └── utils.ts
│   │
│   └── types/
│
├── .env.local
├── package.json
└── README.md
```

### Backend

An illustrative Express backend structure:

```text
booknook-backend/
│
├── middleware/
│   └── verifyJWT.ts
│
├── index.js
├── .env
├── package.json
└── README.md
```

> Directory names and file extensions may differ depending on the final project structure.

---

## 🚀 Getting Started

Follow the instructions below to run BookNook locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- MongoDB Atlas or a local MongoDB instance
- Required authentication provider credentials, if applicable

### 1. Clone the Repositories

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
git clone YOUR_BACKEND_REPOSITORY_URL
```

### 2. Install Frontend Dependencies

Navigate to the frontend project:

```bash
cd booknook-frontend
npm install
```

### 3. Configure Frontend Environment Variables

Create a `.env.local` file in the frontend root directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-better-auth-secret

BETTER_AUTH_DB_URL=your-mongodb-connection-string
```

Add any other environment variables required by your authentication providers.

**Important:** Never expose private credentials through `NEXT_PUBLIC_` environment variables.

### 4. Install Backend Dependencies

Open another terminal:

```bash
cd booknook-backend
npm install
```

### 5. Configure Backend Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=8000

BETTER_AUTH_URL=http://localhost:3000

MONGODB_URI=your-mongodb-connection-string

FRONTEND_URL=http://localhost:3000
```

Ensure the variable names match your actual backend configuration.

### 6. Start the Backend

```bash
npm run dev
```

Use the appropriate start command if your backend uses a different script.

The backend should be available at:

```text
http://localhost:8000
```

### 7. Start the Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Your BookNook application should now be running locally.

---

## 🔌 REST API Endpoints

BookNook uses REST APIs for book management and borrowing operations.

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Backend health or welcome response |
| GET | `/books` | Retrieve books |
| GET | `/books/new-arrivals` | Retrieve newly added books |

### Protected Endpoints

These endpoints require a valid JWT.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books/:id` | Retrieve book details |
| POST | `/add-book` | Add a book |
| GET | `/my-books` | Retrieve authenticated user's books |
| PATCH | `/my-books/:id` | Update a book |
| DELETE | `/my-books/:id` | Delete a book |
| POST | `/borrows` | Borrow a book |
| GET | `/borrows` | Retrieve active borrowings |
| GET | `/borrows/check` | Check borrowing status |
| DELETE | `/borrows/:id` | Return a borrowed book |

### Authentication Header

Protected requests include:

```http
Authorization: Bearer <jwt-token>
```

The Express backend verifies the JWT before processing protected operations.

---

## 🔐 Authentication Flow

BookNook uses Better Auth and JWT verification to authenticate requests between the frontend and backend.

```text
User
 │
 ▼
Sign In / Sign Up
 │
 ▼
Better Auth
 │
 ▼
Authenticated Session
 │
 ▼
JWT Token Request
 │
 ▼
Frontend API Client
 │
 ▼
Authorization: Bearer JWT
 │
 ▼
Express JWT Middleware
 │
 ▼
JWKS Signature Verification
 │
 ▼
Authenticated API Request
 │
 ▼
MongoDB Operation
```

### JWT Verification

The backend uses the `jose` library to verify tokens against the Better Auth JWKS endpoint.

Verification includes:

- JWT signature validation.
- Issuer validation.
- Audience validation.
- Token expiration checks.
- Required user identity claim validation.

The verified user identity is attached to the Express request for use by protected routes.

---

## 🛡️ Security Considerations

BookNook includes several security-focused implementation decisions.

### Authentication

Protected backend routes require JWT authentication.

### Verified User Identity

The backend obtains user identity from verified JWT claims rather than trusting client-submitted identity fields.

### Protected Pages

Authenticated pages validate the user's session on the server.

### Centralized API Client

Authenticated frontend requests use a shared API client to attach JWT authorization headers.

### Authorization

Backend routes should enforce ownership checks before modifying or deleting user-specific records.

### Environment Variables

Sensitive credentials are stored in environment variables and must never be committed to the repository.

### Production Security

Before production deployment, verify:

- HTTPS configuration.
- CORS restrictions.
- JWT verification settings.
- Input validation.
- Rate limiting.
- MongoDB access permissions.
- Secure error handling.
- Dependency security.

> Security auditing and production hardening should be completed before treating the application as production-secure.

---

## 📱 Responsive Design

BookNook provides an adaptive experience across different devices.

### Desktop

- Organized book collections.
- Responsive data tables.
- Spacious page layouts.
- Accessible book management actions.

### Tablet

- Flexible grids.
- Adaptive content spacing.
- Responsive navigation.

### Mobile

- Compact book cards.
- Touch-friendly action buttons.
- Responsive dialogs.
- Optimized reading and borrowing interfaces.

---

## 🌍 Deployment

### Frontend

The Next.js application can be deployed on **Vercel**.

Recommended steps:

1. Push the frontend project to GitHub.
2. Import the repository into Vercel.
3. Configure the environment variables.
4. Deploy the Next.js application.
5. Verify authentication and API connectivity.

### Backend

Deploy the Express backend to a compatible Node.js hosting platform or supported serverless environment.

Recommended steps:

1. Configure the production MongoDB connection.
2. Set the production `BETTER_AUTH_URL`.
3. Configure the allowed frontend origin in CORS.
4. Verify the JWKS endpoint is accessible.
5. Test authenticated API requests.
6. Verify database authorization and borrowing operations.

### Production Environment Variables

Frontend:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com

BETTER_AUTH_URL=https://your-frontend-domain.com

BETTER_AUTH_SECRET=your-production-secret

BETTER_AUTH_DB_URL=your-production-database-url
```

Backend:

```env
BETTER_AUTH_URL=https://your-frontend-domain.com

MONGODB_URI=your-production-database-url

FRONTEND_URL=https://your-frontend-domain.com
```

Use the actual variable names required by your project.

---

## 🔮 Future Improvements

Potential future enhancements include:

- 🔎 Advanced book searching and filtering.
- 🏷️ Genre-based book categorization.
- ❤️ Favorite books and reading wishlists.
- 📊 Personal reading statistics.
- 🔔 Borrowing deadline reminders.
- 📧 Email notifications.
- ⭐ Book ratings and reviews.
- 👩‍💼 Administrative dashboard.
- 📈 Library analytics.
- 📱 Progressive Web App support.

---

## 👩‍💻 Author

**Mahjabin Jannat**

Computer Science & Engineering Graduate  
Full-Stack Web Development Enthusiast

**GitHub:** [Mahjabinjannat](https://github.com/Mahjabinjannat)

---

## 🤝 Contributions

Suggestions, feedback, and contributions are welcome.

If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your updates.
5. Push your branch.
6. Open a pull request.

---

## ⭐ Support

If you like BookNook or find it useful, consider giving this repository a ⭐ on GitHub.

Your support is appreciated!

---

<div align="center">

### 📚 BookNook

**Discover More. Read More. Enjoy More.**

Made with ❤️ using Next.js, Express.js & MongoDB.

</div>
