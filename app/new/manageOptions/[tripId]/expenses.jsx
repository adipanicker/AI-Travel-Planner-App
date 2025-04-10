import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { app } from "../../../../configs/FirebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "../../../../constants/Colors";

const { width } = Dimensions.get("window");

const firestore = getFirestore(app);

export default function Expenses() {
  const { tripId } = useLocalSearchParams();
  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [budget, setBudget] = useState("");
  const [editBudget, setEditBudget] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!tripId) {
        console.error("Trip ID is missing");
        return;
      }

      try {
        const tripDoc = await getDoc(doc(firestore, "ManagedTrips", tripId));
        if (tripDoc.exists()) {
          const data = tripDoc.data();
          setExpenses(data.expenses || []);
          setBudget(data.budget || "");
          setCurrency(data.currency || "USD");
          setTotalExpense(
            (data.expenses || []).reduce(
              (sum, expense) => sum + (expense.amount || 0),
              0
            )
          );
        } else {
          console.error("No trip found with the provided tripId");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [tripId]);

  const handleAddExpense = async () => {
    if (!expenseType || !amount || parseFloat(amount) <= 0) {
      Alert.alert(
        "Error",
        "Please select an expense type and enter a valid amount."
      );
      return;
    }

    const newExpense = {
      type: expenseType,
      amount: parseFloat(amount),
      description,
      currency,
      date: new Date().toISOString(),
    };

    try {
      const tripDocRef = doc(firestore, "ManagedTrips", tripId);
      await updateDoc(tripDocRef, {
        expenses: arrayUnion(newExpense),
      });

      setExpenses([...expenses, newExpense]);
      setTotalExpense(totalExpense + newExpense.amount);
      setExpenseType("");
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error adding expense:", error);
      Alert.alert("Error", "Failed to add expense. Please try again.");
    }
  };

  const handleCurrencyChange = async (newCurrency) => {
    setCurrency(newCurrency);
    try {
      const tripDocRef = doc(firestore, "ManagedTrips", tripId);
      await updateDoc(tripDocRef, { currency: newCurrency });
    } catch (error) {
      console.error("Error saving currency:", error);
      Alert.alert("Error", "Failed to save currency. Please try again.");
    }
  };

  const expenseTypes = [
    { type: "Food", icon: "restaurant-outline" },
    { type: "Transport", icon: "car-outline" },
    { type: "Stay", icon: "bed-outline" },
    { type: "Activities", icon: "bicycle-outline" },
    { type: "Other", icon: "ellipsis-horizontal-circle-outline" },
  ];

  const renderExpenseTypeButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.expenseTypeButton,
        expenseType === item.type && styles.activeExpenseTypeButton,
      ]}
      onPress={() => setExpenseType(item.type)}
    >
      <Ionicons name={item.icon} size={30} color="#fff" />
      <Text style={styles.expenseTypeText}>{item.type}</Text>
    </TouchableOpacity>
  );

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseItemLeft}>
        <View style={styles.expenseIconContainer}>
          <Ionicons
            name={
              {
                Food: "restaurant-outline",
                Transport: "car-outline",
                Stay: "bed-outline",
                Activities: "bicycle-outline",
                Other: "ellipsis-horizontal-circle-outline",
              }[item.type] || "cash-outline"
            }
            size={24}
            color="#fff"
          />
        </View>
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseTitle}>{item.type}</Text>
          <Text style={styles.expenseDescription}>
            {item.description || "No description"}
          </Text>
        </View>
      </View>
      <Text style={styles.expenseAmount}>
        {item.currency} {item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <>
              {/* SECTION 1: Header */}
              <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Expense Tracker</Text>
              </View>

              {/* SECTION 2: Budget & Total Expenses */}
              <View style={styles.budgetSection}>
                <Text style={styles.sectionTitle}>Trip Finance</Text>

                {editBudget ? (
                  <View style={styles.budgetContainer}>
                    <TextInput
                      style={styles.budgetInput}
                      placeholder="Enter Trip Budget"
                      value={budget}
                      onChangeText={setBudget}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      onPress={async () => {
                        if (!budget || parseFloat(budget) <= 0) {
                          Alert.alert("Error", "Please enter a valid budget.");
                          return;
                        }
                        try {
                          const tripDocRef = doc(
                            firestore,
                            "ManagedTrips",
                            tripId
                          );
                          await updateDoc(tripDocRef, { budget, currency });
                          setEditBudget(false);
                        } catch (error) {
                          console.error("Error saving budget:", error);
                          Alert.alert(
                            "Error",
                            "Failed to save budget. Please try again."
                          );
                        }
                      }}
                      style={styles.setBudgetButton}
                    >
                      <Text style={styles.setBudgetButtonText}>Set</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.financeInfoContainer}>
                    <View style={styles.financeInfoItem}>
                      <Text style={styles.financeLabel}>Budget:</Text>
                      <View style={styles.financeValueContainer}>
                        <Text style={styles.financeValue}>
                          {currency} {budget || "0"}
                        </Text>
                        <TouchableOpacity onPress={() => setEditBudget(true)}>
                          <Ionicons
                            name="create-outline"
                            size={18}
                            color="#007AFF"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.financeInfoItem}>
                      <Text style={styles.financeLabel}>Total Expense:</Text>
                      <Text style={styles.financeValue}>
                        {currency} {totalExpense.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.financeInfoItem}>
                      <Text style={styles.financeLabel}>Remaining:</Text>
                      <Text
                        style={[
                          styles.financeValue,
                          {
                            color:
                              budget && budget - totalExpense < 0
                                ? "#FF3B30"
                                : "#34C759",
                          },
                        ]}
                      >
                        {currency}{" "}
                        {budget ? (budget - totalExpense).toFixed(2) : "N/A"}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* SECTION 3: Currency Selection */}
              <View style={styles.currencySection}>
                <Text style={styles.sectionTitle}>Currency</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={currency}
                    onValueChange={handleCurrencyChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="USD - US Dollar" value="USD" />
                    <Picker.Item label="EUR - Euro" value="EUR" />
                    <Picker.Item label="INR - Indian Rupee" value="INR" />
                    <Picker.Item label="GBP - British Pound" value="GBP" />
                  </Picker>
                </View>
              </View>

              {/* SECTION 4: Add Expense */}
              <View style={styles.addExpenseSection}>
                <Text style={styles.sectionTitle}>Add New Expense</Text>

                {/* Expense Type Selection */}
                <Text style={styles.inputLabel}>Expense Type</Text>
                <FlatList
                  data={expenseTypes}
                  renderItem={renderExpenseTypeButton}
                  keyExtractor={(item) => item.type}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.expenseTypeList}
                />

                {/* Amount and Description Fields */}
                <Text style={styles.inputLabel}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Amount in ${currency}`}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Description (e.g. Dinner at restaurant)"
                  value={description}
                  onChangeText={setDescription}
                />

                {/* Add Button */}
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddExpense}
                >
                  <Text style={styles.addButtonText}>Add Expense</Text>
                </TouchableOpacity>
              </View>

              {/* SECTION 5: Expense List Header */}
              {expenses.length > 0 && (
                <View style={styles.expenseListSection}>
                  <Text style={styles.sectionTitle}>Your Expenses</Text>
                </View>
              )}
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Ionicons name="wallet-outline" size={64} color="#cccccc" />
              <Text style={styles.emptyStateText}>No expenses added yet</Text>
              <Text style={styles.emptyStateSubText}>
                Track your spending by adding expenses
              </Text>
            </View>
          }
          // In your Expenses component, modify the ListFooterComponent section
          // Replace the current PieChart implementation with this aggregated version

          // Replace the current ListFooterComponent with this dual chart implementation

          ListFooterComponent={
            expenses.length > 0 ? (
              <>
                {/* Category-wise Spending Chart */}
                <View style={styles.chartSection}>
                  <Text style={styles.chartTitle}>Spending by Category</Text>
                  <View style={styles.chartContainer}>
                    <PieChart
                      data={
                        // Group and aggregate expenses by type
                        Object.entries(
                          expenses.reduce((acc, item) => {
                            // If this category already exists, add to its amount
                            if (acc[item.type]) {
                              acc[item.type] += item.amount;
                            } else {
                              // Otherwise create a new category
                              acc[item.type] = item.amount;
                            }
                            return acc;
                          }, {})
                        ).map(([type, amount], index) => ({
                          name: type,
                          amount: amount,
                          color: [
                            "#FF6384", // Food - Pink
                            "#36A2EB", // Transport - Blue
                            "#FFCE56", // Stay - Yellow
                            "#4BC0C0", // Activities - Teal
                            "#9966FF", // Other - Purple
                          ][
                            // Map category to consistent color
                            {
                              Food: 0,
                              Transport: 1,
                              Stay: 2,
                              Activities: 3,
                              Other: 4,
                            }[type] || index % 5
                          ],
                          legendFontColor: "#333",
                          legendFontSize: 14,
                        }))
                      }
                      width={width - 48}
                      height={220}
                      chartConfig={{
                        backgroundColor: "#fff",
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      }}
                      accessor="amount"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </View>
                </View>

                {/* Individual Expenses Chart */}
                <View style={styles.chartSection}>
                  <Text style={styles.chartTitle}>
                    Individual Expense Breakdown
                  </Text>
                  <View style={styles.chartContainer}>
                    <PieChart
                      data={expenses.map((item, index) => {
                        // Create a more descriptive name that includes amount
                        const shortDesc = item.description
                          ? item.description.length > 15
                            ? item.description.substring(0, 15) + "..."
                            : item.description
                          : item.type;

                        return {
                          name: `${shortDesc} (${currency} ${item.amount})`,
                          amount: item.amount,
                          color: [
                            "#FF6384", // Food - Pink
                            "#36A2EB", // Transport - Blue
                            "#FFCE56", // Stay - Yellow
                            "#4BC0C0", // Activities - Teal
                            "#9966FF", // Other - Purple
                          ][
                            // Map category to consistent color
                            {
                              Food: 0,
                              Transport: 1,
                              Stay: 2,
                              Activities: 3,
                              Other: 4,
                            }[item.type] || index % 5
                          ],
                          legendFontColor: "#333",
                          legendFontSize: 12,
                        };
                      })}
                      width={width - 48}
                      height={220}
                      chartConfig={{
                        backgroundColor: "#fff",
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      }}
                      accessor="amount"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />
                  </View>
                </View>
              </>
            ) : null
          }
          contentContainerStyle={styles.listContentContainer}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  listContentContainer: {
    paddingBottom: 24,
  },

  // SECTION 1: Header
  headerSection: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  // Common section styling
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.PRIMARY,
  },

  // SECTION 2: Budget & Total Expenses
  budgetSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    fontFamily: "outfit-bold",
    backgroundColor: "#f9f9f9",
  },
  setBudgetButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  setBudgetButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  financeInfoContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 16,
  },
  financeInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  financeInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  financeLabel: {
    fontSize: 16,
    color: "#555",
  },
  financeValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  financeValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  // SECTION 3: Currency Selection
  currencySection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },

  // SECTION 4: Add Expense
  addExpenseSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    marginTop: 12,
  },
  expenseTypeList: {
    marginBottom: 16,
  },
  expenseTypeButton: {
    backgroundColor: "#d1d1d1",
    padding: 14,
    borderRadius: 12,
    width: 90,
    alignItems: "center",
    marginRight: 10,
    marginVertical: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  activeExpenseTypeButton: {
    backgroundColor: "#007AFF",
  },
  expenseTypeText: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  addButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // SECTION 5: Expense List
  expenseListSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  expenseItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expenseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  expenseDetails: {
    marginLeft: 12,
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 14,
    color: "#666",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Chart Section
  chartSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },

  // Empty State
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
  },
});
