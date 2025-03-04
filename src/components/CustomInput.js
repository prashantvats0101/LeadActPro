import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomTextInput = ({
  placeholder,
  value,
  iconName = "input",
  keyboardType,
  onChangeText,
  maxLength,
  defaultValue,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Icon name={iconName} size={24} color="#666" style={styles.icon} />
      <TextInput
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={styles.input}
        defaultValue={defaultValue}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light grey background
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginVertical: 5,
    marginHorizontal: 16,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

export default CustomTextInput;
