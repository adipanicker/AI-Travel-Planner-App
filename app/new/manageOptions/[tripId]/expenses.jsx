import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  Alert,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { doc, updateDoc, arrayUnion, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../../../configs/FirebaseConfig';
import { useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const firestore = getFirestore(app);

export default function Expenses() {
  const { tripId } = useLocalSearchParams();
  const [expenseType, setExpenseType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [budget, setBudget] = useState('');
  const [editBudget, setEditBudget] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!tripId) {
        console.error('Trip ID is missing');
        return;
      }

      try {
        const tripDoc = await getDoc(doc(firestore, 'ManagedTrips', tripId));
        if (tripDoc.exists()) {
          const data = tripDoc.data();
          setExpenses(data.expenses || []);
          setBudget(data.budget || '');
          setCurrency(data.currency || 'USD');
          setTotalExpense(
            (data.expenses || []).reduce((sum, expense) => sum + (expense.amount || 0), 0)
          );
        } else {
          console.error('No trip found with the provided tripId');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [tripId]);

  const handleAddExpense = async () => {
    if (!expenseType || !amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please select an expense type and enter a valid amount.');
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
      const tripDocRef = doc(firestore, 'ManagedTrips', tripId);
      await updateDoc(tripDocRef, {
        expenses: arrayUnion(newExpense),
      });

      setExpenses([...expenses, newExpense]);
      setTotalExpense(totalExpense + newExpense.amount);
      setExpenseType('');
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  const handleCurrencyChange = async (newCurrency) => {
    setCurrency(newCurrency);
    try {
      const tripDocRef = doc(firestore, 'ManagedTrips', tripId);
      await updateDoc(tripDocRef, { currency: newCurrency });
    } catch (error) {
      console.error('Error saving currency:', error);
      Alert.alert('Error', 'Failed to save currency. Please try again.');
    }
  };

  const expenseTypes = [
    { type: 'Food', icon: 'restaurant-outline' },
    { type: 'Transport', icon: 'car-outline' },
    { type: 'Stay', icon: 'bed-outline' },
    { type: 'Activities', icon: 'bicycle-outline' },
    { type: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
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
        <Ionicons
          name={
            {
              Food: 'restaurant-outline',
              Transport: 'car-outline',
              Stay: 'bed-outline',
              Activities: 'bicycle-outline',
              Other: 'ellipsis-horizontal-circle-outline',
            }[item.type] || 'cash-outline'
          }
          size={24}
          color="#4A90E2"
        />
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseTitle}>{item.type}</Text>
          <Text style={styles.expenseDescription}>{item.description || 'No description'}</Text>
        </View>
      </View>
      <Text style={styles.expenseAmount}>
        {item.currency} {item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Expense Tracker</Text>
        </View>
       

        {/* Budget Section */}
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
                  Alert.alert('Error', 'Please enter a valid budget.');
                  return;
                }
                try {
                  const tripDocRef = doc(firestore, 'ManagedTrips', tripId);
                  await updateDoc(tripDocRef, { budget });
                  setEditBudget(false);
                } catch (error) {
                  console.error('Error saving budget:', error);
                  Alert.alert('Error', 'Failed to save budget. Please try again.');
                }
              }}
              style={styles.setBudgetButton}
            >
              <Text style={styles.setBudgetButtonText}>Set</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.budgetDisplayContainer}>
            <Text style={styles.budgetText}>
              Budget: {currency} {budget}
            </Text>
            <TouchableOpacity onPress={() => setEditBudget(true)}>
              <Ionicons name="create-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.totalExpense}>
          Total Expense: {currency} {totalExpense.toFixed(2)}
        </Text>

        {/* Currency Picker */}
        <Picker
          selectedValue={currency}
          onValueChange={handleCurrencyChange}
          style={styles.picker}
        >
          <Picker.Item label="USD" value="USD" />
          <Picker.Item label="EUR" value="EUR" />
          <Picker.Item label="INR" value="INR" />
          <Picker.Item label="GBP" value="GBP" />
        </Picker>

        {/* Expense Type Buttons (Horizontal FlatList) */}
        <FlatList
          data={expenseTypes}
          renderItem={renderExpenseTypeButton}
          keyExtractor={(item) => item.type}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.expenseTypeList}
        />

        {/* Add Expense */}
        <View style={styles.addExpenseContainer}>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        {/* Expense List */}
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.expenseList}
        />

        {/* Pie Chart */}
        <PieChart
          data={expenses.map((item, index) => ({
            name: item.type,
            amount: item.amount,
            color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
            legendFontColor: '#333',
            legendFontSize: 14,
          }))}
          width={width - 50}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            color: (opacity) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontFamily: 'outfit-bold',
  },
  setBudgetButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  setBudgetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  budgetDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  budgetText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalExpense: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    marginBottom: 20,
  },
  expenseTypeList: {
    marginBottom: 20,
  },
  expenseTypeButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
  },
  activeExpenseTypeButton: {
    backgroundColor: '#007AFF',
  },
  expenseTypeText: {
    color: '#fff',
    marginTop: 5,
    fontWeight: 'bold',
  },
  addExpenseContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  expenseList: {
    marginBottom: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  expenseItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseDetails: {
    marginLeft: 10,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
