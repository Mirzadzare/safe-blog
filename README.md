# !safe-blog

A modern blog platform built for learning **secure web architecture**. This project is constantly developed, tested, and pentested by me to improve my security skills.
## Demo
<img width="2288" height="1226" alt="Screenshot 2025-11-18 at 12 44 31 AM" src="https://github.com/user-attachments/assets/34839f10-d406-4f5e-b540-c74c34e83a89" />
<img width="2288" height="1226" alt="Screenshot 2025-11-18 at 12 45 36 AM" src="https://github.com/user-attachments/assets/a16ab261-d959-4d11-b8bf-f31a36dc5243" />
<img width="2288" height="1226" alt="Screenshot 2025-11-18 at 12 45 41 AM" src="https://github.com/user-attachments/assets/afa203c0-df24-40f0-b1ed-88b9e4f40dfa" />
<img width="2288" height="1226" alt="Screenshot 2025-11-18 at 12 45 46 AM" src="https://github.com/user-attachments/assets/9336f985-1513-48d7-ba32-5ce41ccc82fa" />
<img width="2288" height="1226" alt="Screenshot 2025-11-18 at 12 48 57 AM" src="https://github.com/user-attachments/assets/370bbe7e-1949-4fd0-8858-24bcc9aeafb5" />

## Features

### Authentication

* **Email + Password Login**
* **OAuth Login**
* **JWT-based authentication**
* **Secure Sign‑up / Login / Logout**

### Posts & Interactions

* **Create / Edit / Delete Posts**
* **Comment on posts**
* **Like / Unlike comments**
* **Search posts bytags, date, title, and content**

### Admin Panel

* **Update Profile Picture**
* **Change Username**
* **Update Password**
* **Delete Account**
* **User Management**

  * **View / Edit / Delete Users**
* **Post Management**

  * **Create / Edit / Delete Posts**
  * **Upload Header Image**
* **Statistics & Dashboard**

### User Panel

* **Update Profile Picture**
* **Change Username**
* **Update Password**
* **Delete Account**

## Tech Stack

* **Frontend:** React.js, Redux, Tailwind, Vite
* **Backend:** Node.js (Express)
* **Database:** MongoDB

## Setup
To set up and run the !Safe-Blog project, follow these steps:

### Prerequisites

- Node.js installed on your machine
- Git for version control

### Installation

#### Clone the repository:
```bash
git clone https://github.com/Mirzadzare/safe-blog.git
cd FunPark
```
#### Install dependencies:
Navigate to both the frontend and backend directories and install the necessary packages:
```bash
cd Frontend
npm i
cd ../Backend
npm i
```
### Running the Application

#### **Backend Setup**

1. Create and update your `backend/.env` file with the required environment variables.
   **Example `backend/.env`:**

```
MONGO='your-mongodb-connection-string'
JWT_SECRET='your-jwt-secret'
CLOUDINARY_CLOUD_NAME='your-cloud-name'
CLOUDINARY_API_KEY='your-cloudinary-api-key'
CLOUDINARY_API_SECRET='your-cloudinary-api-secret'
```

2. Start the backend server:

```bash
cd Backend
npm start
```

#### **Frontend Setup**

3. Add your **Firebase API key** inside `frontend/.env` using:

```
VITE_FIREBASE_APIKEY=your-firebase-api-key
```

4. Update your Firebase configuration in:

* `frontend/src/firebase.js`

5. Set your backend API URL in:

* `frontend/vite.config.js`

6. Start the frontend development server:

```bash
cd Frontend
npm run dev
```
