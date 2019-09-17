## Details on how I set up this project

### how I set up firebase

#### Initial installation

- [instructions](https://create-react-app.dev/docs/deployment#firebase-https-firebasegooglecom)
- sign up for firebase https://console.firebase.google.com
- install firebase tools `npm install -g firebase-tools`
- log in to firebase `firebase login`
- `firebase init`
  - for "what is your project folder" I chose `build`

#### first deploy

1. `npm run build`
2. `firebase deploy`

#### adding user authentication

instructions [here](https://github.com/firebase/firebaseui-web#option-2-npm-module)

```
$ npm install firebase --save
$ npm install firebaseui --save
```
