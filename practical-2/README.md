# Practical 2: State Management and Routing in React

## Objective
To implement reactive state management using `useState` and multi-page navigation using React Router.

## Architecture
- `App.jsx` (wrapped in `<BrowserRouter>`)
  - `NavBar.jsx` (links to all routes, theme toggle button)
  - `Route: "/"` → `Home.jsx` (renders Header, About, Skills, Footer)
  - `Route: "/projects"` → `Projects.jsx` (displays portfolio projects)
  - `Route: "/contact"` → `Contact.jsx` (controlled form using `useState` for inputs, character count, and success screen)
  - `Route: "*"` → `NotFound.jsx` (custom 404 error page)

## Features Included
1. **React Router Integration**: Single page application navigation without browser reload.
2. **State Management**:
   - Theme toggle (light/dark class applied to the root element).
   - Message textarea character counter.
   - Form field controlled inputs.
   - Tooltip/help state or dynamic success banner.

## How to Run

1. Navigate to this directory:
   ```bash
   cd practical-2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
