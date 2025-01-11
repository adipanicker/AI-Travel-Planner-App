import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function TripNotepad() {
  const { tripId } = useLocalSearchParams();

  // State for notes, tags, images, and current text formatting
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState("");
  const [savedNotes, setSavedNotes] = useState(null);

  // Load saved notes when component mounts
  useEffect(() => {
    const loadNotes = async () => {
      const storedNotes = await AsyncStorage.getItem(`trip_notes_${tripId}`);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        setNotes(parsedNotes.notes || "");
        setImages(parsedNotes.images || []);
        setTags(parsedNotes.tags || "");
      }
    };
    loadNotes();
  }, [tripId]);

  // Save notes to local storage
  const saveNotes = async () => {
    const noteData = { notes, images, tags, updatedAt: new Date().toISOString() };
    await AsyncStorage.setItem(`trip_notes_${tripId}`, JSON.stringify(noteData));
    setSavedNotes(noteData);
    alert("Notes saved successfully!");
  };

  // Image Picker Handler
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notepad for Trip ID: {tripId}</Text>
      <ScrollView style={styles.scrollContainer}>
        {/* Text Input for Notes */}
        <TextInput
          style={styles.textInput}
          placeholder="Start writing your notes here..."
          value={notes}
          onChangeText={(text) => setNotes(text)}
          multiline
        />

        {/* Tags Input */}
        <TextInput
          style={styles.tagInput}
          placeholder="Add tags (e.g., Ideas, Restaurants)..."
          value={tags}
          onChangeText={(text) => setTags(text)}
        />

        {/* Image Preview */}
        <ScrollView horizontal style={styles.imageContainer}>
          {images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </ScrollView>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Add Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={saveNotes}>
            <Text style={styles.buttonText}>Save Notes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Saved Notes */}
      {savedNotes && (
        <View style={styles.savedNotes}>
          <Text style={styles.savedNotesText}>
            Last Saved: {new Date(savedNotes.updatedAt).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  scrollContainer: {
    flex: 1,
  },
  textInput: {
    backgroundColor: "#fff",
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
  },
  tagInput: {
    backgroundColor: "#fff",
    padding: 10,
    fontSize: 14,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  savedNotes: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e6f7e6",
    borderRadius: 8,
  },
  savedNotesText: {
    fontSize: 14,
    color: "#2b7a2b",
  },
});
