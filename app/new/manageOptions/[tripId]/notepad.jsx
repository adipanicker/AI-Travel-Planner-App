import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../../../configs/FirebaseConfig";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";

const firestore = getFirestore(app);

export default function Notepad() {
  const { tripId } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  // Function to fetch notes
  const fetchNotes = async () => {
    setLoading(true);
    if (!tripId) {
      console.error("Trip ID is missing");
      setLoading(false);
      return;
    }
    try {
      const tripDoc = await getDoc(doc(firestore, "ManagedTrips", tripId));
      if (tripDoc.exists()) {
        const data = tripDoc.data();
        setNotes(data.notes || []);
      } else {
        console.error("No trip found with the provided tripId");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
    setLoading(false);
  };

  // Fetch notes when component mounts
  useEffect(() => {
    fetchNotes();
  }, [tripId]);

  // Add a listener for when the screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchNotes();
    });

    return unsubscribe;
  }, [navigation]);

  const renderNoteCard = ({ item }) => (
    <View style={styles.noteCard}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Trip Diary ❤️</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : notes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Write about your wonderful experiences, save useful information, and
            keep track of contacts you made on this trip. Let this notepad be
            your treasure trove of memories!
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNoteCard}
          keyExtractor={(item, index) => index.toString()}
          style={styles.notesList}
        />
      )}

      {/* Help Button */}
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => setHelpModalVisible(true)}
      >
        <Ionicons name="help-circle" size={30} color="#007AFF" />
      </TouchableOpacity>

      {/* Add Note Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push(`/new/manageOptions/${tripId}/noteCard`)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Help Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={helpModalVisible}
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              🌟 Use this notepad to:
              {"\n\n"}• Record your wonderful experiences and favorite memories.
              {"\n"}• Save useful information like addresses, schedules, or
              directions.
              {"\n"}• Keep track of contacts you made on this trip.
              {"\n"}• Jot down ideas, reminders, or anything that inspires you!
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setHelpModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "outfit-bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  notesList: {
    marginBottom: 20,
  },
  noteCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noteContent: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "black",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 20,
    elevation: 5,
  },
  helpButton: {
    position: "absolute",
    bottom: 110,
    right: 35,
    backgroundColor: "transparent",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
