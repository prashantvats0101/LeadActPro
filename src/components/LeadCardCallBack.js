import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LeadCardContactCallBack = ({ title, subtitle, onCallPress, onSmsPress, onWhatsappPress,oncardPress,mobile,source,navigation,project,follow_up }) => {
  return (
    <View style={styles.card}>
      {/* Left Section: Title and Subtitle */}
      <TouchableOpacity onPress={oncardPress} navigation={navigation}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.iconContainers}><Text>{source}</Text></View>
        <Text style={styles.subtitle}>{project}</Text>
        <Text>Reminder:{follow_up}</Text>
      </View>
      </TouchableOpacity>

      {/* Right Section: Icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onCallPress} navigation={navigation}>
          <MaterialCommunityIcons name="phone" size={24} color="lightgreen" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={onSmsPress} navigation={navigation}>
          <MaterialCommunityIcons name="message-text" size={24} color="blue" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity onPress={onWhatsappPress} navigation={navigation}>
          <MaterialCommunityIcons name="whatsapp" size={24} color="green" />
        </TouchableOpacity>
       
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    elevation: 4, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    //marginTop: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  iconContainers:{
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
  }
});

export default LeadCardContactCallBack;
