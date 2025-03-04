import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import CustomButton from './../../components/CustomButton';
import TextareaWithIcon from './../../components/TextArea';
import {_post} from '../../api/apiClient';
import {showSuccess} from './../../components/FlashMessage';
import {Alert} from 'react-native';

const LostDetails = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {item} = route.params;
  const [notes, setNotes] = useState('');
  const [substatus, setSubStatus] = useState('');
  const dropdownData = [
    {label: 'Better Deal/Already Purchased', value: 4},
    {label: 'Loan Issue', value: 5},
    {label: 'Finance Concern', value: 6},
    {label: 'Plan Postponed', value: 7},
  ];

  const handleSubmit = async () => {
    const data ={
      subsubstatus_id : substatus,
      notes : notes
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('subsubstatus_id', substatus);
    formData.append('notes', notes);
    try {
      const response = await _post(
        `/lead/lostleads/save/${item?.id}`,data,
      );
      //const result = response?.data;
      if (response.status == 200) {
        showSuccess('Lost Updated Succesfully');
        navigation.replace('InterestedLead', {item: item});
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
      <Text style={styles.title}>LOST REASON</Text>
      <CustomDropdown
        data={dropdownData}
        onSelect={item => setSubStatus(item?.value)}
        placeholder="Choose an option"
      />
      <Text style={styles.title}>NOTES</Text>
      <TextareaWithIcon value={notes} onChangeText={text => setNotes(text)} />

      <View style={{margin: 16}}>
        <CustomButton
          title={isLoading ? 'Submit...' : 'Submit'}
          onPress={handleSubmit}
          isLoading={isLoading}
          disabled={false}
          textStyle={{fontSize: 18}}
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

export default LostDetails;
