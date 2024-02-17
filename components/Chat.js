import { useState, useEffect } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  getDocs,
  query,
  addDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";
import { Audio } from "expo-av";

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, color, userID } = route.params; // Get the name and selected background color for the chat
  const [messages, setMessages] = useState([]);
  let soundObject = null;

  // Messages database
  let unsubMessages;
  useEffect(() => {
    if (isConnected === true) {
      if (unsubMessages) {
        unsubMessages();
      }
      unsubMessages = null;

      // 5. In Chat.js, fetch messages from the database in real time:
      // Listen for new messages in Firestore
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (querySnapshot) => {
        let newMessages = [];
        querySnapshot.forEach((doc) => {
          console.log(doc);
          newMessages.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });

        cacheMessages(newMessages); // Cache the new messages
        setMessages(newMessages);
      });
    } else {
      loadCachedMessages(); // load the cashed messages
    }

    // Clean up code
    return () => {
      if (unsubMessages) {
        unsubMessages();
        if (soundObject) soundObject.unloadAsync();
      }
    };
  }, [db, isConnected]);

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("chat_messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  const cacheMessages = async (listsToCache) => {
    try {
      await AsyncStorage.setItem("chat_messages", JSON.stringify(listsToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // 6. Update onSend function to save sent messages on the Firestore database
  // Function to handle sending new messages
  const onSend = (newMessages) => {
    console.log("onSend function called with:", newMessages);
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Custom styling for chat message bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#757083",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  // Custom rendering of the input toolbar based on network connectivity
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };


  // Render an action button in Inputfield
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  // Render a MapView if the currentMessage contains location data
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, margin: 6 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  // Render Audio Messages
  const renderAudioBubble = (props) => {
    return (
      <View {...props}>
        <TouchableOpacity
          style={{ backgroundColor: "#FF0", borderRadius: 10, margin: 5 }}
          onPress={async () => {
            try {
              if (soundObject) soundObject.unloadAsync();
              const { sound } = await Audio.Sound.createAsync({
                uri: props.currentMessage.audio,
              });
              soundObject = sound;
              await sound.playAsync();
            } catch (error) {
              console.error("Error playing audio:", error);
            }
          }}
        >
          <Text style={{ textAlign: "center", color: "black", padding: 5 }}>
            Play Sound
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Set user name
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);


  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      {/* GiftedChat component for rendering the chat interface */}

      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        renderMessageAudio={renderAudioBubble}
        onSend={(messages) => onSend(messages)}
        // renderCustomView={renderCustomView}
        // 7. Ensure that GiftedChat will attach the correct user ID and name to the message
        user={{
          _id: userID, // Extract the user ID from route.params
          name: name, // Extract the name from route.params
        }}
      />
      {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
