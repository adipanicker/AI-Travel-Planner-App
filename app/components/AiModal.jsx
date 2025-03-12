import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure your API key is correctly configured
const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;

// Initialize GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI({ apiKey });

const AiModal = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    if (!input.trim()) {
      alert('Please enter a question!');
      return;
    }

    try {
      const res = await genAI.generateMessage({
        prompt: {
          context: 'You are a helpful assistant.',
          messages: [
            {
              content: input,
            },
          ],
        },
        model: 'models/chat-bison-001', // Ensure correct model name
      });

      // Assuming the AI response is in `res.candidates[0].content`
      setResponse(res?.candidates?.[0]?.content || 'Sorry, I have no response.');
    } catch (error) {
      console.error('Error communicating with Gemini AI:', error);
      setResponse('Sorry, I could not process your request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ask Gemini AI</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your question..."
        value={input}
        onChangeText={setInput}
      />
      <Button title="Send" onPress={handleSend} />
      {response && <Text style={styles.response}>{response}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  response: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default AiModal;
