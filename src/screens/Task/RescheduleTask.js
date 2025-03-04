import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomButton from './../../components/CustomButton';
import TextareaWithIcon from './../../components/TextArea';
import DateTimePickerComponent from './../../components/DateTimeSelector';
import {showError, showSuccess} from './../../components/FlashMessage';
import {_post} from '../../api/apiClient';

const RescheduleTask = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {item} = route.params;
  const [notes, setNotes] = useState('');
  const [substatus, setSubStatus] = useState('');
  const [callBackTime, setCallBackTime] = useState('');

  const handleDateTimeSubmit = isoDateTime => {
    setCallBackTime(isoDateTime);
    // This will output: 2025-01-29T10:03:00.000Z
  };

  const handleSubmit = async () => {
    const data = {
      followup_on: callBackTime,
      notes: notes,
    };
    setIsLoading(true);
    const formData = new FormData();
    formData.append('followup_on', callBackTime);
    formData.append('notes', notes);
    try {
      const response = await _post(
        `/leads/taskreschedule/save/${item?.id}`,data,
      );
      if (response.status == 200) {
        showSuccess('Lead Reschedule Succesfully');
        navigation.replace('InterestedLead', {item: item});
      } else {
        showError('No data found.');
      }
    } catch (error) {
      console.error('API Error:', error);
      //showError('Error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>NEXT FOLLOW UP DATE AND TIME</Text>
      <DateTimePickerComponent onDateChange={handleDateTimeSubmit} />
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

export default RescheduleTask;
