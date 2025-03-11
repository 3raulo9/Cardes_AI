# Cardes AI

> **A full-stack AI-powered project** – combining a Django REST API backend with a React frontend.

<p align="center">
  <img src="https://img.shields.io/badge/Django-4.2+-success?style=for-the-badge" alt="Django Version">
  <img src="https://img.shields.io/badge/React-18.2+-brightgreen?style=for-the-badge" alt="React Version">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License Badge">
</p>

## Table of Contents

- [Cardes AI](#cardes-ai)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Backend Setup (Django)](#backend-setup-django)
    - [Create Virtual Environment](#create-virtual-environment)
    - [Install Dependencies](#install-dependencies)
    - [Setup Environment Variables](#setup-environment-variables)
    - [Run Migrations \& Development Server](#run-migrations--development-server)
  - [Frontend Setup (React)](#frontend-setup-react)
    - [Install Dependencies](#install-dependencies-1)
    - [Setup Environment Variables](#setup-environment-variables-1)
    - [Configure Backend URL](#configure-backend-url)
    - [Run Development Server](#run-development-server)
  - [Additional Notes](#additional-notes)

---

## Project Overview

**Cardes AI** is a project that leverages:

- **Django REST Framework** for the backend
- **React** for a modern, responsive UI
- **Various third-party APIs** (e.g., Google OAuth, Elabs text-to-speech, etc.)

Below, you’ll find instructions for setting up the entire stack locally.

---

## Backend Setup (Django)

### Create Virtual Environment

1. **Install** `virtualenv` if you haven’t already:

   ```bash
   pip install virtualenv
   ```

2. **Create** and **activate** your virtual environment:

   ```bash
   virtualenv env
   # On macOS/Linux:
   source env/bin/activate
   # On Windows:
   .\env\Scripts\activate
   ```

### Install Dependencies

Once the virtual environment is active, run:

```bash
pip install -r requirements.txt
```

*(Ensure your `requirements.txt` contains packages like `django`, `djangorestframework`, `python-dotenv`, etc.)*

### Setup Environment Variables

Create a file named **.env** in your backend root folder (where **manage.py** resides). Add the following:

```bash
GOOGLE_API_KEY="API for gemini API"
ELABS_API_KEY="API for elabs"
VOICE_ID="voice from elabs that the user wants to use"
ALLOWED_HOSTS="localhost,your-frontend-domain.com"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
DJANGO_SECRET_KEY="your-secret-key"
```

**Tip:**  
- You can generate a secure secret key with:
  
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(50))"
  ```
  
- **ALLOWED_HOSTS** is a comma-separated list of domains that your Django app will accept requests from.

### Run Migrations & Development Server

1. **Apply Migrations**:

   ```bash
   python manage.py migrate
   ```

2. **Create a Superuser** (optional):

   ```bash
   python manage.py createsuperuser
   ```

3. **Start the Development Server**:

   ```bash
   python manage.py runserver
   ```

Your backend should now be accessible at [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## Frontend Setup (React)

### Install Dependencies

Navigate to your React project folder (where **package.json** is located) and run:

```bash
npm install
```

### Setup Environment Variables

In the React root directory, create a file named **.env**:

```bash
REACT_APP_YOUTUBE_API_KEY="that one API for youtube search"
REACT_APP_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
REACT_APP_BACKEND_URL="http://127.0.0.1:8000/"  # Change this if your backend is hosted remotely
```

### Configure Backend URL

To ensure the React frontend connects properly to the Django backend, update **cardes-ai/src/utils/axiosInstance.js** with the following:

```javascript
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000/", // Use environment variable with fallback
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
```

### Run Development Server

Start your React app:

```bash
npm start
```

This usually launches at [http://localhost:3000](http://localhost:3000). Ensure your Django server is running (default port 8000) or update endpoints accordingly.

---

## Additional Notes

- **Production:**
  - Set **DEBUG=False** in Django and configure your **ALLOWED_HOSTS** properly.
  - In React, run **npm run build** to create an optimized production build in the **build** folder.
- **Security:** Never commit your **.env** files to Git or any public repo. Add **.env** to your **.gitignore**.
- **API Calls:** Double-check that your React code references the correct environment variables when communicating with the Django backend or external APIs.


