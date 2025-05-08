import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  Day,
} from "react-native-gifted-chat";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigation } from "@react-navigation/native";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;

// Initialize GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(apiKey);

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const navigation = useNavigation();

  // Load saved messages when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem("chatMessages");
        const savedHistory = await AsyncStorage.getItem("chatHistory");

        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          // Set default welcome message if no saved messages
          setMessages([
            {
              _id: 1,
              text: "Hi! I'm your personal AI trip assistant. How can I help you plan your next adventure?",
              createdAt: new Date(),
              user: {
                _id: 2,
                name: "TripAI",
                avatar:
                  "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg",
              },
            },
          ]);
        }

        if (savedHistory) {
          setChatHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        // Set default message if there's an error
        setMessages([
          {
            _id: 1,
            text: "Hi! I'm your personal AI trip assistant. How can I help you plan your next adventure?",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "TripAI",
              avatar: "https://i.imgur.com/7k12EPD.png",
            },
          },
        ]);
      }
    };

    loadMessages();
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem("chatMessages", JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving messages:", error);
      }
    };

    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  // Save chat history whenever it changes
  useEffect(() => {
    const saveHistory = async () => {
      try {
        await AsyncStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    };

    if (chatHistory.length > 0) {
      saveHistory();
    }
  }, [chatHistory]);

  // Update chat history when messages change
  useEffect(() => {
    // Skip if no messages yet
    if (messages.length <= 1) return;

    // Convert GiftedChat messages to Gemini chat format
    // We need to process them in chronological order (oldest first)
    const reversedMessages = [...messages].reverse();

    const newChatHistory = [];

    for (const msg of reversedMessages) {
      if (msg.user._id === 1) {
        // User message
        newChatHistory.push({
          role: "user",
          parts: [{ text: msg.text }],
        });
      } else if (msg.user._id === 2) {
        // AI message (skip the initial welcome message)
        if (msg._id !== 1) {
          newChatHistory.push({
            role: "model",
            parts: [{ text: msg.text }],
          });
        }
      }
    }

    setChatHistory(newChatHistory);
  }, [messages]);

  // Function to call Gemini API with improved prompting
  const getGeminiResponse = async (userMessage) => {
    try {
      // Create a model instance with the working model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create an instruction prefix to guide responses
      const instructions =
        "You are LetsGo AI, a helpful travel assistant that specializes in helping users plan trips. " +
        "Your responses should be focused on travel planning, destination advice, itinerary suggestions, " +
        "and local attractions, budget planning. Be concise and direct (under 100 words when possible), friendly and " +
        "enthusiastic about travel. Always provide specific recommendations and currency in INR. " +
        "Even if the user's question seems off-topic, ask user to stick to travel questions in a friendly and polite way.\n\n" +
        "User message: ";

      // Enhanced prompt with instructions
      const enhancedPrompt = instructions + userMessage;

      // For the first message, use direct generation
      if (chatHistory.length === 0) {
        const result = await model.generateContent(enhancedPrompt);
        return result.response.text();
      }

      // For subsequent messages, use chat history without system role
      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      });

      // Generate a response with instructions included in the message
      const result = await chat.sendMessage(enhancedPrompt);
      return result.response.text();
    } catch (error) {
      console.error("Error communicating with Gemini AI:", error);
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  };

  // Handle sending messages
  const handleSend = useCallback(
    async (newMessages = []) => {
      // Add user message to chat
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      const userMessage = newMessages[0].text;

      setIsTyping(true);

      try {
        // Get response from Gemini
        const botResponse = await getGeminiResponse(userMessage);

        // Create AI message
        const aiMessage = {
          _id: Math.random().toString(36).substring(2, 11),
          text: botResponse,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "TripAI",
            avatar:
              "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg",
          },
        };

        // Add AI message to chat
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [aiMessage])
        );
      } catch (error) {
        // Handle errors gracefully
        const errorMessage = {
          _id: Math.random().toString(36).substring(2, 11),
          text: "Sorry, I couldn't process your request. Please try again later.",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "TripAI",
            avatar:
              "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg",
          },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [errorMessage])
        );
      } finally {
        // Stop typing indicator
        setIsTyping(false);
      }
    },
    [chatHistory]
  );

  // Clear chat history
  const handleClearChat = async () => {
    try {
      await AsyncStorage.removeItem("chatMessages");
      await AsyncStorage.removeItem("chatHistory");

      setMessages([
        {
          _id: 1,
          text: "Hi! I'm your personal AI trip assistant. How can I help you plan your next adventure?",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "TripAI",
            avatar:
              "https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg",
          },
        },
      ]);
      setChatHistory([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Custom chat bubbles
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#7C4DFF",
            borderBottomRightRadius: 15,
            borderTopRightRadius: 15,
            borderBottomLeftRadius: 15,
          },
          left: {
            backgroundColor: "#2E3440",
            borderBottomRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
          },
        }}
        textStyle={{
          right: {
            color: "#FFFFFF",
          },
          left: {
            color: "#E5E9F0",
          },
        }}
        timeTextStyle={{
          right: {
            color: "#D8DEE9",
          },
          left: {
            color: "#81A1C1",
          },
        }}
      />
    );
  };

  // Custom input toolbar
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "#2E3440",
          borderTopWidth: 1,
          borderTopColor: "#3B4252",
          paddingHorizontal: 8,
          paddingTop: 6,
        }}
        primaryStyle={{
          alignItems: "center",
        }}
        textInputStyle={{
          color: "#E5E9F0",
          backgroundColor: "#3B4252",
          borderRadius: 20,
          borderWidth: 0,
          paddingHorizontal: 12,
          marginRight: 5,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      />
    );
  };

  // Custom send button
  const renderSend = (props) => {
    return (
      <Send
        {...props}
        containerStyle={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          marginRight: 5,
          marginBottom: 5,
        }}
      >
        <View style={styles.sendButton}>
          <MaterialIcons name="send" size={24} color="#7C4DFF" />
        </View>
      </Send>
    );
  };

  // Custom day display
  const renderDay = (props) => {
    return (
      <Day
        {...props}
        textStyle={{
          color: "#81A1C1",
          fontWeight: "500",
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2127" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#7C4DFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <View style={styles.activeDot} />
          <View style={styles.headerTitle}>
            <MaterialIcons name="travel-explore" size={20} color="#7C4DFF" />
            <View style={styles.titleText}>
              <Text style={styles.headerText}>LetsGo! AI Assistant</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
          <MaterialIcons name="refresh" size={22} color="#7C4DFF" />
        </TouchableOpacity>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => handleSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderDay={renderDay}
        isTyping={isTyping}
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={() => (
          <MaterialIcons name="arrow-downward" size={24} color="#7C4DFF" />
        )}
        infiniteScroll
        inverted={Platform.OS !== "web"}
        timeFormat="HH:mm"
        dateFormat="MMMM D, YYYY"
        placeholder="Message LetsGo AI..."
        minInputToolbarHeight={60}
        bottomOffset={Platform.OS === "ios" ? 30 : 0}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2127", // Dark background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3B4252",
    backgroundColor: "#2E3440",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    marginLeft: 8,
  },
  headerText: {
    color: "#E5E9F0",
    fontSize: 18,
    fontWeight: "600",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#A3BE8C", // Green for "active"
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3B4252",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    padding: 4,
  },
});

export default ChatScreen;
