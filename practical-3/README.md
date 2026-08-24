# Practical 3: API Integration and Data Rendering in React

## Objective
To consume a REST API in React and handle asynchronous data with loading and error states.

## Architecture
- `Projects.jsx`
  - `useEffect()` → triggers API request on component mount or simulation toggle
  - `useState` → manages `repos`, `loading`, `error`, `searchQuery`, and `simulateError`
  - Dynamic display: spinner (loading), card (error with retry), or repo list (success)

## Features Included
1. **GitHub API Integration**: Fetches repository list for the user dynamically.
2. **Search Input**: Filters repository cards by name in real-time.
3. **Robust State Handling**: Shows loading animations and custom error screens.
4. **Retry Request Action**: Allows re-triggering API calls directly from the error component.
5. **Interactive Error Simulator**: Toggle button in the header allows examiners to test both paths (happy and error path) instantly.

## How to Run

1. Navigate to this directory:
   ```bash
   cd practical-3
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
