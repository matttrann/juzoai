# Flashcard Learning App

This project is a React application for creating and studying flashcards with features for performance tracking, deck import/export, and algorithm visualization.

## Features

- Create and manage flashcard decks
- Study with interactive flashcards
- Import and export decks
- Dark mode UI
- Personal performance dashboard
- Algorithm and data structure visualizations
- OAuth authentication with GitHub and Google

## Environment Setup

1. Copy the `.env.example` file to a new file named `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit the `.env.local` file and add your OAuth credentials:
   ```
   REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_AUTH_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

3. To obtain OAuth credentials:
   - For GitHub: Create a new OAuth app at https://github.com/settings/developers
   - For Google: Create credentials at https://console.cloud.google.com/apis/credentials

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Security Notes

- The OAuth implementation uses the authorization code flow for better security
- For production deployment, configure your server to use HTTPS
- In a real production environment, use an API backend to handle OAuth token exchange
- Store authentication tokens in HTTP-only cookies rather than localStorage for enhanced security
