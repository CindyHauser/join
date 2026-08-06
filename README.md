# Join

A responsive Kanban-style task management web app designed for team collaboration, contact management, and lightweight project tracking.

## Overview

`Join` provides:
- user login and signup flows
- task summary dashboard with metrics
- drag-and-drop Kanban board with status columns
- task creation and task assignment to contacts
- contact management with add/edit capabilities
- help, privacy policy, and legal notice pages

The project is built as a static HTML/CSS/JavaScript app with Firebase REST database integration for user and contact persistence.

## Main Pages

- `index.html` - Login page with guest login option
- `HTML/signup.html` - User registration page
- `HTML/summary.html` - Summary dashboard with task metrics and greeting
- `HTML/board.html` - Kanban board with drag-and-drop task cards
- `HTML/addtask.html` - Add task page and task form UI
- `HTML/contact.html` - Contact list, expanded contact view, and add/edit contact overlay
- `HTML/help.html` - Help page
- `HTML/privacy-policy-external.html` / `HTML/privacy-policy-internal.html` - Privacy policy pages
- `HTML/legal-notice-external.html` / `HTML/legal-notice-internal.html` - Legal notice pages

## Key Features

- Login validation and password visibility toggle
- Signup form validation, password confirmation, and duplicate account prevention
- Task board with columns: To Do, In Progress, Awaiting Feedback, Done
- Search functionality for board tasks
- Add task dialog with due date, priority, category, and contact assignment
- Contacts list with add/edit contact overlays
- Persistent user session data in `sessionStorage`
- Responsive layout for desktop and mobile

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Firebase Realtime Database REST API

## Getting Started

1. Clone or download the repository.
2. Open `index.html` in a browser.
3. Use signup to create a new user or log in with an existing account.
4. Use the dashboard, board, and contact pages to manage tasks and team contacts.

> For a better local experience, run a simple static server such as `Live Server` in VS Code or a local HTTP server.

## Project Structure

- `index.html` - login landing page
- `readme.txt` - development changelog
- `style.css` - global site styles
- `styles/` - page-specific and responsive CSS
- `HTML/` - main page content for internal navigation
- `js/` - app logic, validation, board handling, contacts, and signup/login flows
- `assets/` - icons, fonts, and logo assets

## Important JavaScript Files

- `js/validateForm.js` - reusable form validation helpers and password toggles
- `js/login.js` - login submission, Firebase user lookup, and session storage handling
- `js/signup.js` - signup form handling, user creation, and backend data posting
- `script.js` - global helpers, page init functions, profile menu, and navigation utilities
- `js/summary.js` - summary page rendering and greeting logic
- `js/addTaskInit.js`, `js/addTask*.js` - task creation and custom dropdown/contact selection logic
- `js/board*.js` - Kanban rendering, drag-and-drop, task search, and task detail dialogs
- `js/contact*.js` - contact rendering, overlay forms, and contact UI state

## Notes

- `signup2.html` exists in the project but is not currently linked from other pages.
- The Firebase base URL is included in `js/login.js` and `js/signup.js`.
- Login and signup communicate with the backend using simple `fetch` requests.

## Changelog

The repository includes a development changelog in `readme.txt` documenting feature progress and fixes through late July 2026.

## Contributors

- Kevin Eberheim
- Arnesto Arnesto
- Cindy Hauser

---

Enjoy using `Join` for lightweight project planning and team task coordination.