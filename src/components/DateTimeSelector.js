import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const DateTimePickerComponent = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState('date');

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const currentDate = selectedDate || date;
      setDate(currentDate);

      if (Platform.OS === 'android') {
        if (mode === 'date') {
          setMode('time');
          setShowPicker(true);
          return;
        }
        if (mode === 'time') {
          setShowPicker(false);
          sendDateToApi(currentDate);
        }
      } else {
        sendDateToApi(currentDate);
      }
    } else {
      setShowPicker(false);
    }
  };

  const sendDateToApi = (selectedDate) => {
    const isoDate = selectedDate.toISOString(); // Converts to 2025-01-29T10:03:00.000Z format
    onDateChange(isoDate);
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.inputContainer}
        onPress={() => setShowPicker(true)}
      >
        <TextInput
          style={styles.input}
          pointerEvents="none"
          placeholder="Select date and time"
          value={formatDisplayDate(date)}
          editable={false}
        />
        <Icon name="calendar-today" size={20} color="#666" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode={Platform.OS === 'ios' ? 'datetime' : mode}
          display="spinner"
          onChange={handleDateChange}
          minimumDate={new Date()}
          themeVariant="light"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    marginHorizontal:16
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
});

export default DateTimePickerComponent;