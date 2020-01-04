## Grow Us

The frontend app is built with React + Typescript (a special form of Javascript). The backend is Firebase.

### Get started with local development

Developer tools

1. We use [VS Code](https://code.visualstudio.com/Download). Because it has the best inline typescript error message support, and the remote pairing plugin is supposedly decent.

- be sure to install `Babel JavaScript`,

Set up the frontend dependencies, one-time:

1. clone this repo locally `git clone https://github.com/sunmoyed/growus.git`
2. enter the project folder `cd growus`
3. install the frontend dependencies: `npm install`. (you might have to install npm first.)
4. wait for a million years

To run the web app locally, every time:

5. run the local server: `npm start`
6. npm will aggressively open up a new browser tab at `http://localhost:3000`, where you can see your web app. (To not auto-open browser, run `BROWSER=none npm start` instead)
7. ~~to run the backend locally: `firebase serve`~~ actually I have no idea how this works

### How to deploy

Setup for deploy:

- sign up for firebase https://console.firebase.google.com
- install firebase tools `npm install -g firebase-tools`
- log in to firebase `firebase login`

how to deploy to firebase (available at https://grow-us.web.app)

1. `npm run deploy`

### problems

1. can't develop with firebase offline ): need better way to mock data

## npm Scripts

- This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- I ran `npx create-react-app grow-us --typescript`

npm scripts that come with create-react-app:

1. `npm start`

   Runs the app in the development mode.<br>
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

   The page will reload if you make edits.<br>
   You will also see any lint errors in the console.

2. `npm test`

   Launches the test runner in the interactive watch mode.<br>
   See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

3. `npm run build`

   Builds the app for production to the `build` folder.<br>
   It correctly bundles React in production mode and optimizes the build for the best performance.

   The build is minified and the filenames include the hashes.<br>
   Your app is ready to be deployed!

   See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
