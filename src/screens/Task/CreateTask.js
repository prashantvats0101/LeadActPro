import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import CustomButton from './../../components/CustomButton';
import TextareaWithIcon from './../../components/TextArea';
import DateTimePickerComponent from './../../components/DateTimeSelector';
import {_post} from '../../api/apiClient';
import {showError, showSuccess} from './../../components/FlashMessage';

const CreateTask = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {item,screen} = route.params;
  const [notes, setNotes] = useState('');
  const [substatus, setSubStatus] = useState('');
  const [callBackTime, setCallBackTime] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [followUpTime, setfollowUpTime] = useState('');

  console.log("crestetetete",screen);
  

  const dropdownData = [
    {label: 'Completed', value: 1},
    {label: 'Cancel', value: 2},
  ];

  const followUpType = [
    {label: 'FollowUP', value: 5},
    {label: 'Meeting', value: 6},
    {label: 'Site Visit', value: 7},
  ];
  const handleDateTimeSubmit = isoDateTime => {
    console.log('Formatted ISO date:', isoDateTime);
    setfollowUpTime(isoDateTime);
  };

  const handleSubmit = async () => {
    const data = {
      substatus_id: followUp,
      followup_on: followUpTime,
      task_status: substatus,
      notes: notes,
    };

    setIsLoading(true);
    const formData = new FormData();
    formData.append('substatus_id', followUp);
    formData.append('followup_on', followUpTime);
    formData.append('task_status', substatus);
    formData.append('notes', notes);
    console.log('data', data);

    try {
      const response = await _post(`/leads/taskcreate/save/${item?.id}`, data);
      //const result = response?.data;
      if (response.status == 200) {
        showSuccess('Lead Reschedule Succesfully');
        navigation.navigate('InterestedLead', {item: item});
      } else {
        showError('No data found.');
      }
    } catch (error) {
      console.error('API Error:', error);
      //showError("Error", "Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>EXISTING TASK STATUS</Text>
      <CustomDropdown
        data={dropdownData}
        onSelect={item => setSubStatus(item?.value)}
        placeholder="Choose an option"
      />
      <Text style={styles.title}>NEXT FOLLOW UP</Text>
      <CustomDropdown
        data={followUpType}
        onSelect={item => setFollowUp(screen ? screen : item?.value)}
        placeholder={screen ? screen : "Choose an option"}
      />
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

export default CreateTask;
