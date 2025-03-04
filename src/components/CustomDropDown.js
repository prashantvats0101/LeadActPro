import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';

const CustomDropDown = ({ data, onSelect, placeholder }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePress = () => setExpanded(!expanded);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setExpanded(false);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Accordion
          style={{ backgroundColor: '#ebedf0',height: 55,}}
          title={selectedItem ? selectedItem.label : placeholder || 'Select an item'}
          expanded={expanded}
          onPress={handlePress}
          
        >
          {data.map((item) => (
            <List.Item
              key={item.value}
              title={item.label}
              onPress={() => handleSelect(item)}
            />
          ))}
        </List.Accordion>
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderRadius: 28,
    marginHorizontal:14,
  },
});

export default CustomDropDown;
