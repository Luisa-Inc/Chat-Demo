import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const image = require("../assets/BackgroundImage.png");

const backgroundColors = {
  a: "#090C08",
  b: "#474056",
  c: "#8A95A5",
  d: "#B9C6AE",
};

const Start = ({ navigation }) => {
  // Initialize Firebase authentication
  const auth = getAuth();
  const [name, setName] = useState("");
  const [color, setColor] = useState(backgroundColors.a);

  const signInUser = () => {
    // 4. In the Start.js screen, log the user in anonymously.
    // Sign in anonymously using Firebase
    signInAnonymously(auth)
      .then((result) => {
        // Navigate to the Chat screen with user information
        navigation.navigate("Chat", {
          userID: result.user.uid,
          name: name,
          color: color,
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.", error);
      });
  };

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Render the Chat App title */}
        <Text style={styles.appTitle}>Chat App</Text>
        <View style={styles.inputContainer}>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior="padding"
            enabled
          >
            {/* Input field for user's nickname */}
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Nickname"
              placeholderTextColor="#757083"
            />
            <Text style={styles.textColorSelector}>
              Choose background color:
            </Text>
            <View style={styles.colorSelector}>
              {/* Background color selection buttons */}
              <TouchableOpacity
                style={[
                  styles.circle,
                  color === backgroundColors.a && styles.selectedCircle,
                  { backgroundColor: backgroundColors.a },
                ]}
                onPress={() => setColor(backgroundColors.a)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.circle,
                  color === backgroundColors.b && styles.selectedCircle,
                  { backgroundColor: backgroundColors.b },
                ]}
                onPress={() => setColor(backgroundColors.b)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.circle,
                  color === backgroundColors.c && styles.selectedCircle,
                  { backgroundColor: backgroundColors.c },
                ]}
                onPress={() => setColor(backgroundColors.c)}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.circle,
                  color === backgroundColors.d && styles.selectedCircle,
                  { backgroundColor: backgroundColors.d },
                ]}
                onPress={() => setColor(backgroundColors.d)}
              ></TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          {/* Button to start chatting */}
          <TouchableOpacity style={styles.button} onPress={signInUser}>
            <Text style={styles.buttonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "space-between",
    padding: "6%",
  },
  appTitle: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    alignSelf: "center",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    padding: "6%",
    paddingBottom: 20,
  },
  textInput: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    padding: 15,
    borderWidth: 1,
    borderColor: "#757083",
    marginTop: 15,
    marginBottom: 15,
  },
  textColorSelector: {
    fontSize: 16,
    fontWeight: "300",
    color: "#8A95A5",
    marginBottom: 10,
  },
  colorSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: "#FF0000",
  },
  button: {
    backgroundColor: "#757083",
    padding: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Start;
