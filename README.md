# Jobify Backend

Jobify is a complete backend system for a modern job portal platform. It is built using **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. This backend includes user authentication, role-based access control, job posting and application features, file upload, real-time chat, email notifications, and external API integrations.

---

## 🚀 Features

* User registration & login with JWT authentication
* Role-based access control (`admin`, `employer`, `applicant`)
* CRUD for job postings (only for employers)
* Job application system for applicants
* File upload (e.g. CVs)
* Real-time chat using Socket.IO
* Email notifications (e.g. job updates, registration)
* External API integration (location autocomplete, news, etc.)
* Admin tools & user/job moderation
* RESTful API structure
* Clean and scalable project structure

---

## 🧰 Tech Stack

* **Node.js** - JavaScript runtime
* **Express.js** - Web server framework
* **PostgreSQL** - Relational database
* **Prisma** - ORM for database access
* **JWT** - Authentication (access and refresh tokens)
* **Socket.IO** - Real-time communication
* **Multer** - File uploads
* **Nodemailer** - Email service
* **Axios / Fetch** - Open API integrations

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/jobify-backend.git
cd jobify-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
DATABASE_URL="postgresql://yourusername:yourpassword@localhost:5432/jobify"
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:3000
```

### 4. Initialize Prisma & Run Migration

```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
├── controllers/        # Route logic
├── routes/             # Express routes
├── middlewares/        # Auth, validation, etc
├── services/           # Business logic
├── prisma/             # Prisma client setup
├── utils/              # Helper functions
├── uploads/            # Uploaded files (e.g. CVs)
server.js               # Entry point
.env                    # Environment variables
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Developed by **Rafi Jauhari**
