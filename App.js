// Import necessary modules and components
import Start from "./components/Start";
import Chat from "./components/Chat";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogBox, Alert } from "react-native";
// 2.Install firebase@10.3.1 using npm.
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { useNetInfo } from "@react-native-community/netinfo";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD0I7yqzb-2ZUAV2FSZxA8P1Ai6XL2cx_g",
  authDomain: "chat-app-dbe17.firebaseapp.com",
  projectId: "chat-app-dbe17",
  storageBucket: "chat-app-dbe17.appspot.com",
  messagingSenderId: "860663769893",
  appId: "1:860663769893:web:cdfa6c54641b06a9e748cc",
};

// Initialize Firebase with the configuration
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Create the navigator
const Stack = createNativeStackNavigator();

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
LogBox.ignoreLogs(['@firebase/auth: Auth']);

const App = () => {
  // Get network connection status
  const connectionStatus = useNetInfo();

  useEffect(() => {
    // Handle network connection changes
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db); // Disable Firebase Firestore network
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db); // Enable Firebase Firestore network
    }
  }, [connectionStatus.isConnected]);


  // 1. Create a new Firestore database.
  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);
  const storage = getStorage(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
