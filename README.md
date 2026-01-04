# 📝 Smart ToDo API

A secure, scalable, and production-ready **RESTful API** for task management with authentication, email verification, and full CRUD operations.

> ⚠️ **Important for Reviewers:**  
> The complete API can be tested directly using the **Postman Collection link below**.

---

## 🚀 Live Postman Collection

### 👉 **Postman Collection URL**
🔗 **https://www.postman.com/payload-participant-53886508/workspace/sahin-s-public-collections/collection/26052006-e27dce85-bea7-4d53-86e9-8731489ce9a9?action=share&source=copy-link&creator=26052006**

> ✔ Includes **Auth APIs**, **Task CRUD**, **Error cases**, and **Protected routes**  
> ✔ Cookie-based authentication supported  
> ✔ Works directly with the **live deployed API on Vercel**  
> ✔ No local setup required to test the API  

---

## 🔧 Postman Environment Setup

### ▶️ Live API (Deployed on Vercel)

## This backend is **publicly deployed**, so you can test it **immediately** via Postman.

## Create the following environment variable in Postman:

```env
BASE_URL = https://smarttodoapi.vercel.app/api/v1
🖥️ Local Setup (Optional)

If you prefer to run the API locally on your machine, follow the steps below.

1️⃣ Clone the repository
git clone https://github.com/your-username/SmartToDoAPI.git
cd SmartToDoAPI

2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables

Create a .env file in the root directory:

PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_ACCESS_TOKEN=your_jwt_secret
EMAIL_HOST=your_smtp_host
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
URL=http://localhost:4000
NODE_ENV=development

4️⃣ Start the development server
npm run dev


The API will be available at:

http://localhost:4000

5️⃣ Use Postman locally

Update the Postman environment variable:

BASE_URL = http://localhost:4000/api/v1


The same Postman collection works for both live and local environments by simply switching the BASE_URL.

🧠 Note for Reviewers

This project is deployed and publicly accessible.
All API flows can be tested instantly via Postman using the live URL above, or locally if preferred.


## 🚀 Features

### 🔐 Authentication & Security
- User Registration with Email Verification
- Secure Login using **JWT (HTTP-only cookies)**
- Logout support
- Forgot Password & Reset Password flow
- Password hashing using **bcrypt**
- Protected routes using authentication middleware

### ✅ Task Management
- Create tasks
- Get all tasks (user-specific)
- Update tasks (partial updates supported)
- Delete tasks
- Tasks are **isolated per user**

### 🛡️ Best Practices
- Proper HTTP status codes
- Centralized validation
- Clean error handling
- Secure cookie configuration
- Environment-based configuration
- MongoDB + Mongoose schema design
- Scalable folder structure

---

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **JWT (jsonwebtoken)**
- **bcryptjs**
- **Zod** (request validation)
- **Nodemailer** (email handling)
- **Postman** (API testing)

---

## 📂 Project Structure

SmartToDoAPI/
├── src/
│ ├── controllers/
│ │ ├── auth.controllers.js
│ │ └── task.controllers.js
│ ├── models/
│ │ ├── user.model.js
│ │ └── task.model.js
│ ├── routes/
│ │ ├── auth.routes.js
│ │ └── task.routes.js
│ ├── middlewares/
│ │ ├── auth.middleware.js
│ │ └── validate.js
│ ├── validators/
│ │ └── auth.validators.js
│ ├── utils/
│ │ └── mail.js
│ └── index.js
├── .env
├── package.json
└── README.md


▶️ Getting Started
1️⃣ Clone the repository
git clone https://github.com/sahinmallick/SmartToDoAPI.git
cd SmartToDoAPI

2️⃣ Install dependencies
npm install

3️⃣ Run the server
npm run dev


Server will start at:

http://localhost:3000

🔑 Authentication Flow

Register user

Receive email verification link

Verify account

Login (JWT stored in HTTP-only cookie)

Access protected routes

📌 API Endpoints
Auth Routes
Method	Endpoint	Description
POST	/api/v1/auth/register	Register new user
GET	/api/v1/auth/verify-user/:token	Verify email
POST	/api/v1/auth/login	Login user
POST	/api/v1/auth/logout	Logout user
POST	/api/v1/auth/forgot-password	Request reset
POST	/api/v1/auth/reset-password/:token	Reset password
GET	/api/v1/auth/user	Get current user

Task Routes (Protected)
Method	Endpoint	Description
POST	/api/v1/tasks	Create task
GET	/api/v1/tasks	Get all tasks
PUT	/api/v1/tasks/:id	Update task
DELETE	/api/v1/tasks/:id	Delete task

🧪 API Testing

Tested using Postman

Cookie-based authentication supported

Collection includes:

Auth flows

Task CRUD

Error cases

🧠 Design Decisions

Cookie-based JWT chosen for security against XSS

Tasks scoped to users for isolation

Zod used for strict request validation

Password hashing handled via Mongoose hooks

Clear separation of concerns (controllers, models, routes)

📈 Possible Enhancements

Role-based access control (RBAC)

Task pagination & filtering

Rate limiting

Unit & integration tests

👨‍💻 Author

Sahin Mallick
Full-Stack Developer
hi@sahinmallick.tech