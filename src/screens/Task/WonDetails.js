import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import CustomButton from './../../components/CustomButton';
import TextareaWithIcon from './../../components/TextArea';
import {_post} from '../../api/apiClient';
import {showSuccess} from './../../components/FlashMessage';

const WonDetails = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {item} = route.params;
  const [notes, setNotes] = useState('');
  const [substatus, setSubStatus] = useState('');
  const dropdownData = [
    {label: 'Cheque Colleted', value: 1},
    {label: 'Application Form Collected', value: 2},
    {label: 'All Done', value: 3},
  ];

  const handleSubmit = async () => {
    const data = {
      subsubstatus_id : substatus,
      notes : notes
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('subsubstatus_id', substatus);
    formData.append('notes', notes);
    try {
      const response = await _post(
        `/leads/wonleads/save/${item?.id}`,data
      );
      if (response.status == 200) {
        showSuccess('Won Lead Updated Succesfully');
        navigation.replace("InterestedLead",{item:item})
      } else {
        showError('No data found.');
      }
    } catch (error) {
      console.error('API Error:', error);
      //Alert.alert('Error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>WON REASON</Text>
      <CustomDropdown
        data={dropdownData}
        onSelect={item => setSubStatus(item.value)}
        placeholder="Choose an option"
      />
      <Text style={styles.title}>NOTES</Text>
      <TextareaWithIcon value={notes} onChangeText={text => setNotes(text)} />

      <View style={{margin: 16}}>
        <CustomButton
          title={isLoading ? 'Submit...' : 'Submit'}
          //onPress={handlePress}
          isLoading={isLoading}
          disabled={false}
          textStyle={{fontSize: 18}}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  selectedText: {
    marginTop: 16,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
});

export default WonDetails;
