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

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, color, userID } = route.params; // Get the name and selected background color for the chat
  const [messages, setMessages] = useState([]);

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
          console.log(doc)
          newMessages.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          });
        });
        setMessages(newMessages);
        //cacheMessages(newMessages); // Cache the new messages
      });
    } else {
      //loadCachedMessages();
    }

    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    };
  }, [db, isConnected]);

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // 6. Update onSend function to save sent messages on the Firestore database
  // Function to handle sending new messages
  const onSend = (newMessages) => {
    console.log("onSend function called with:", newMessages);
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  // Custom rendering of the input toolbar based on network connectivity
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Custom styling for chat message bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#FFF",
          },
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: color }}>
      {/* GiftedChat component for rendering the chat interface */}

      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
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
