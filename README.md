# G-Insight

## Overview

G-Insight is a React-based web application designed to retrieve and display contacts from Google’s API. This project aims to simplify the process of accessing and managing contacts stored in a Google account.

## Features

- **Google Authentication**: Securely log in using your Google account.
- **Contact Retrieval**: Fetch and display all contacts from your Google account.
- **User Interface**: Clean and intuitive UI for managing contacts.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/g-insight.git
   cd g-insight
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:

- Create a .env file in the root directory.
- Add the following environment variables:
  ```
  REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
  REACT_APP_GOOGLE_CLIENT_SECRET=your-google-client-secret
  ```
4. Start the development server:
   ```
   npm start
   ```
## Usage
1. Open the application in your browser (typically at http://localhost:3000).
2. Click the "Login with Google" button to authenticate.
3. Grant the application access to your Google contacts.
4. View and manage your contacts through the application's interface.

## Project Structure
  ```
├── public
│   ├── index.html
│   └── ...
├── src
│   ├── components
│   │   ├── ContactList.js
│   │   ├── ContactItem.js
│   │   └── ...
│   ├── context
│   │   ├── AuthContext.js
│   │   └── ...
│   ├── services
│   │   ├── googleApi.js
│   │   └── ...
│   ├── App.js
│   ├── index.js
│   └── ...
├── .env
├── package.json
└── README.md
  ```
## Technologies Used
- **React**: Frontend library for building user interfaces.
- **Google AP**I: For accessing Google contacts.
- **OAuth 2.0**: For secure authentication.


