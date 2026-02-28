# Task Management Project
Task management application built with **React**, **Tailwind CSS**, and **custom CSS**. Designed for both individuals and teams to organize, track, and collaborate on tasks efficiently.

## 🌐 Project Demo
https://task-management-project-zeta.vercel.app/

## Features
- **Task CRUD Operations**
  - Create, duplicate, update, and delete tasks
  - Add and manage nested subtasks
  - Track progress visually with a progress bar
  - Auto-update task status: **Todo → In Progress → Review → Done**

- **Task Organization**
  - Support for nested subtasks and task dependencies
  - Advanced filtering, sorting, and keyword-based search

- **Views & Layouts**
  - **Kanban Board View** for workflow visualization
  - **Calendar View** for date-based task planning
  - **Team View** with customizable List View
  - **Dark/Light mode toggle** for personalized UI

- **Collaboration Tools**
  - Comment threads on tasks for team communication
  - Attach files to tasks for easy reference
  - Activity history & audit logs for tracking changes

- **Notifications**
  - Real-time in-app notifications to stay updated

- **Authentication**
  - Secure login system with form-based authentication

## Setup Instructions

1. **Access the App:** Visit the https://task-management-project-zeta.vercel.app/
2. **PWA Installation:** Install the Progressive Web App (PWA) on your local system for easy access.  
3. **Login:** Use your email and a randomly chosen password to log in. Your account will then be accessible.  
4. **Profile Management:**  
   - Manage visibility and theme settings (fully functional)  
   - Create a workplace (functional)  
   - Access help and log out features  
5. **Overview Section:**  
   - Board layout with tabs: **Board, List, Calendar, Team**  
   - Kanban Board sections:  
     - **To-Do (0-30%)** – Starting tasks  
     - **In Progress (31-89%)** – Tasks in development  
     - **Review (90-99%)** – Tasks ready for review  
     - **Done (100%)** – Completed tasks  
   - Add new tasks and view task counts under each section  
6. **Notifications:** Receive real-time notifications for task creation, updates, or deletions.  
7. **Navigation & Filters:** Search tasks, toggle light/dark mode, and use filters/sorting efficiently.

> **Note:** Currently, the app is **front-end only**. All data is handled locally in the browser.

## 💡 Decision Explanation
This project was developed as a front-end only application to **focus on rapid prototyping and user experience**. By handling all logic in the front-end, the app remains lightweight, fast, and easily installable as a PWA. The core goal was to **test task flows, visual organization, and notifications** without the complexity of a back-end. Future updates may include database integration or server-side support once core functionality is stable.

## Tech Stack
- **Frontend:** React
- **Styling:** Tailwind CSS, Custom CSS
