# Chat App

Chat App is a mobile application built using React Native that provides a seamless chatting experience. It offers real-time messaging, multimedia sharing, and location sharing features.

## Dependencies

- React Native: Framework for building mobile applications using JavaScript and React
- Expo: Development platform for building React Native applications.
- GiftedChat: A library for creating chat interfaces in React Native applications.
- Google Firebase: Cloud-based platform that provides various services, including
- Firestore for real-time database and authentication.
- AsyncStorage: Local storage system in React Native for caching and persisting data.
- Expo ImagePicker: Expo API for accessing the device's image picker to choose images from the gallery.
- Expo MediaLibrary: Expo API for accessing and managing media assets on the device.
- Expo Location: Expo API for obtaining location information from a device.
- react-native-maps: React Native Map components for iOS + Android.
- MapView: Specific component from the react-native-maps library used to display maps in - React Native applications.

## Features

- Users can enter their name and choose a background color for the chat screen before joining the chat
- Send and receive messages
- Send and receive images (from media library or device's camera)
- Send and receive locations
- Record, send and receive audio
- Users can view previous messages when offline


## Set up this App

- Install [Node JS](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) on your device
- In the terminal: Install Expo globally: ```npm install -g expo-cli```
- Sign up for an [Expo Account](https://expo.dev/) to be able to run the app on your device
- Clone this repository.
- Navigate to the chat-app folder and run  ```npm install ```
- Use your own Firebase configuration code:
  * Sign in at [Google Firebase](https://firebase.google.com/)
  * Create a Project (uncheck "Enable Google Analytics for this project")
  * Create Database in Firestore Database (choose a close region from the dropdown, and "Start in production mode")
  * Adjust rules from  ```allow read, write: if false; ``` to  ```allow read, write: if true; ```
  * "Register app(</>)" in "Project Overview"
  * Navigate to the chat-app folder and install the Firebase using  ```npm install firebase ```
  * Initialize Firebase by copying and pasting the provided Firebase configuration into the App.js
- Download Android Studio(Win) or iOS Simulator/XCode(Mac) on your computer or use the Expo Go App on your mobile device
- Run  ```npx expo start ``` in your terminal. Follow the instruction to access the app via the iOS Simulator/Android Emulator.