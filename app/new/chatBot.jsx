import React, { useState, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure your API key is correctly configured
const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;

// Initialize GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI({ apiKey });

const Chatbot = () => {
  const [messages, setMessages] = useState([]);

  // Initialize with a welcome message
  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hi! I’m your assistant. How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Gemini AI',
          avatar: 'https://path-to-avatar.png',
        },
      },
    ]);
  }, []);

  const handleSend = useCallback(async (newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

    const userMessage = newMessages[0].text;

    try {
      const res = await genAI.generateMessage({
        prompt: {
          context: 'You are a helpful assistant.',
          messages: [
            {
              content: userMessage,
            },
          ],
        },
        model: 'models/chat-bison-001', // Ensure correct model name
      });

      // Assuming the AI response is in `res.candidates[0].content`
      const botMessage = res?.candidates?.[0]?.content || 'Sorry, I have no response.';

      const botResponse = {
        _id: Math.random().toString(36).substr(2, 9), // Unique ID for GiftedChat
        text: botMessage,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Gemini AI',
          avatar: 'https://path-to-avatar.png',
        },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, [botResponse]));
    } catch (error) {
      console.error('Error communicating with Gemini AI:', error);
      const errorMessage = {
        _id: Math.random().toString(36).substr(2, 9),
        text: 'Sorry, I couldn’t process your request. Please try again later.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Gemini AI',
          avatar: 'https://path-to-avatar.png',
        },
      };

      setMessages((previousMessages) => GiftedChat.append(previousMessages, [errorMessage]));
    }
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => handleSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
};

export default Chatbot;
