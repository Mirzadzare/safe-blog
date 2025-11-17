# !safeblog

A modern blog platform built for learning **secure web architecture**. This project is constantly developed, tested, and pentested by me to improve my security skills.

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
git clone https://github.com/Spix0r/safe-blog.git
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
