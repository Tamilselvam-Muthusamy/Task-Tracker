# Task Tracker

This **Task Tracker** application, inspired by **Jira**, is a powerful tool designed to help teams manage tasks and projects efficiently. Built using **React**, **Mantine**, and **Tailwind CSS**, it provides an intuitive interface for creating, assigning, and tracking tasks across teams, making project management seamless for small to medium-sized teams.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Modules](#modules)
  - [Auth Module](#auth-module)
  - [Dashboard Module](#dashboard-module)
  - [User Module](#user-module)
  - [Project Module](#project-module)
  - [Task Module](#task-module)
- [Technologies Used](#technologies-used)

## Features

- **User Authentication**: Secure login using email and password authentication.
- **User Management**: Role-based access control to manage team members effectively.
- **Project Management**: Create, edit, and manage multiple projects.
- **Task Management**: Assign tasks to team members and track progress.
- **Status Tracking**: Real-time task progress tracking and status updates.

## Installation

1. **Clone the repository**:
    ```bash
    git clone git@github.com:Tamilselvam-Muthusamy/Task-Tracker.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd Task-Tracker
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```
    or
    ```bash
    bun install
    ```

## Usage

To run the application locally:

1. **Start the development server**:
    ```bash
    npm run dev
    ```
    or
    ```bash
    bun run dev
    ```

2. The application will be available at `http://localhost:3000`.

## Modules

### Auth Module
- Users can securely log in using email and password-based authentication.

### Dashboard Module
- Displays a summary of key metrics such as users, projects, tasks, and their respective statuses.

### User Module
- Allows admin to add, view, and update user information for efficient user management.

### Project Module
- Provides project management functionalities, including creating, editing, and retrieving project details.

### Task Module
- Enables task creation, assignment to users, and updating task statuses within specific projects.



## Technologies Used

- **React**: For building the dynamic user interface.
- **Mantine**: For elegant and accessible component design.
- **Tailwind CSS**: For responsive, modern UI styling.
- **Node.js & npm/bun**: For package management and running the development server.

