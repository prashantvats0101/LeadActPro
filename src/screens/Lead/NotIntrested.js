import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import CustomDropdown from './../../components/CustomDropDown';
import TextareaWithIcon from './../../components/TextArea';
import CustomButton from './../../components/CustomButton';
import {showError, showSuccess} from './../../components/FlashMessage';
import {_post} from '../../api/apiClient';

const NotIntrested = ({navigation,route}) => {
  const {item} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [subStatus, setStatusId] = useState('');
  const dropdownData = [
    {label: 'Broker Lead', value: 12},
    {label: 'DND', value: 13},
    {label: 'Invalid Number', value: 14},
    {label: 'Location Mismatched', value: 15},
    {label: 'Low Budget', value: 16},
    {label: 'Not a property seekar', value: 17},
    {label: 'Looking for rental lead', value: 18},
    {label: 'Resale Lead', value: 19},
    {label: 'Loan Issue', value: 20},
  ];

  const handleSubmit = async () => {
    //alert("hello");
    setIsLoading(true);
    const formData = new FormData();
    formData.append('substatus_id', subStatus);
    formData.append('notes', notes);

    console.log('formDatatatatatata', formData, item.id);
    try {
      const response = await _post(
        `leads/notinterested/save/${item?.id}`,
        formData,
      );
      console.log('responseeeeenotin', response.data);
      //const userToken = response.data.access_token;
      // Handle API response
      if (response.status == 200) {
        showSuccess('Lead has been updated sucessfully');
        navigation.popTo('PendingLead',{item:item});
        setIsLoading(false);
      } else {
        showMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('API Error:sss', error);
      //showError('Something went wrong, please try again');
      setIsLoading(false);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>NOT INTERESTED REASON</Text>
      <CustomDropdown
        data={dropdownData}
        onSelect={item => setStatusId(item?.value)}
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

export default NotIntrested;
