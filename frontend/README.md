# Cardes AI Application

Cardes AI is a React and Django-based application designed to facilitate learning and interaction through various features like chat, flashcards, texts, and more.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication (Login/Register)
- Interactive Chat
- Learning Modules
- Flashcards for Revision
- Texts and Articles
- Chat History

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x)
- Python (>= 3.8)
- Django (>= 3.x)
- PostgreSQL (for production)
- SQLite (for development)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/cardes-ai.git
    cd cardes-ai
    ```

2. Set up the backend:
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py createsuperuser
    ```

3. Set up the frontend:
    ```bash
    cd ../frontend
    npm install
    ```

### Running the Application

1. Start the backend server:
    ```bash
    cd backend
    source venv/bin/activate or On Windows use `venv\Scripts\activate`
    python manage.py runserver
    ```

2. Start the frontend server:
    ```bash
    cd ../frontend
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000`.


