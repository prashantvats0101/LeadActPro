import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  FlatList,
  PermissionsAndroid,
  Alert,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TransparentButton from '../../components/TransparentButton';
import {_get, _post} from './../../api/apiClient';
import CallLogs from 'react-native-call-log';
import {useFocusEffect} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

const ContactDetails = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [project_name, setProject_Name] = useState('');
  const [property_type, setProperty_Type] = useState('');
  const [property_stage, setProperty_Stage] = useState('');
  const [alternative_no, setAlternative_No] = useState('');
  const [budget, setbudget] = useState('');
  const [data, setData] = useState([]);
  const {item} = route.params;
  const [callLog, setCalllogs] = useState([]);
  const [deviceName, setDeviceName] = useState('Fetching...');
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [note, setNote] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [leadType, setLeadType] = useState('');

 // // Add a note when the plus button is clicked
  // const addNote = () => {
  //   if (noteText.trim()) {
  //     setNotes([...notes, noteText]);
  //     setNoteText('');
  //   } else {
  //     Alert.alert('Note cannot be empty!');
  //   }
  // };

  // Send notes to API
  const sendNotesToApi = async () => {
    // if (!note.trim()) {
    //   Alert.alert('Error', 'Please enter a note');
    //   return;
    // }
    try {
      const data = {
        notes: note,
      };
      const formData = new FormData();
      formData.append('notes', note);

      const response = await _post(`/leads/notes/save/${item.id}`, data);
    } catch (error) {
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (callLog) {
        sendPostRequest();
      }
    }, [callLog]),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      getDevice();
      fetchData();
      getAllNotes;
    }, 3000); // Run every 1 second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timer);
  }, [callLog]);

  async function fetchData() {
    if (Platform.OS != 'ios') {
      try {
        //Ask for runtime permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          {
            title: 'Call Log Example',
            message: 'Access your call logs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const filter = {
            phoneNumbers: item?.mobile,
          };
          const callLogs = await CallLogs.load(-1, filter);
          setCalllogs(callLogs);
        } else {
          alert('Call Log permission denied');
        }
      } catch (e) {
        console.log("does't have call record of this number", e);
      }
    } else {
      console.log(
        'Sorry! You can’t get call logs in iOS devicesbecause of the security concern',
      );
    }
  }

  const getDevice = async () => {
    if (DeviceInfo.getDeviceName) {
      const name = await DeviceInfo.getDeviceName();

      setDeviceName(name);
    } else {
      setDeviceName('Emulator/Simulator');
    }
  };

  const sendPostRequest = async () => {
    let res = callLog.map(it => {
      let obj = {};
      obj['lead_id'] = item?.id;
      obj['u_time'] = it?.dateTime;
      obj['call_time'] = it?.timestamp;
      obj['number'] = it?.phoneNumber;
      obj['duration'] = it?.duration;
      obj['callType'] = it?.type;
      obj['device_name'] = deviceName;
      return obj;
    });

    try {
      const response = await _post('/calldata', {
        request_data: res,
      });
      const result = response?.data;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLeadView();
    sendPostRequest();
    getAllNotes();
  }, []);

  const getAllNotes = async () => {
    try {
      const response = await _get(`/getnotes/${item?.id}`);
      console.log('response', response.data.data);
      setAllNotes(response.data.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const getLeadView = async () => {
    try {
      const response = await _get(`/leadview/${item?.id}`).then(response => {
        // Destructure `data` from the Axios response
        let obj = [];
        for (let key in response.data) {
          if (key == 'statushistory') {
            let res = response.data[key].map(it => {
              obj.push({
                followup: it.Followup_on,
                notes: it.notes,
                status: it.status,
                substatus: it.substatus,
              });
              // obj.id = it.id;
              // obj.value = it.id;
              return;
            });
            setData(obj);
          }
        }

        const {data} = response;
        console.log("dtatatat",data);
        // Further destructure the `name` property from `data`
        const {
          name,
          email,
          mobile,
          city,
          project_name,
          property_type,
          property_stage,
          alternative_no,
          budget_name,
          lead_source,
          lead_type
        } = data.data; // Assuming the response format
        setName(name);
        setEmail(email);
        setMobile(mobile);
        setCity(city);
        setProject_Name(project_name);
        setProperty_Type(property_type);
        setProperty_Stage(property_stage);
        setAlternative_No(alternative_no);
        setbudget(budget_name);
        setLeadSource(lead_source),
        setLeadType(lead_type)
      });
    } catch (error) {
      console.error('API Error:sss', error);
    }
  };

  const handleCallPress = () => {
    Linking.openURL(`tel:${item?.mobile}`)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(mobile);
        }
      })
      .catch(err => console.log(err));
  };

  const handleSmsPress = () => {
    const url = `sms:${item?.mobile}`; // Using the "sms:" protocol
    Linking.openURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url); // Open the default messaging app
        } else {
          Alert.alert('Error', 'Unable to open the messaging app.');
        }
      })
      .catch(err => console.error('Error opening messaging app:', err));
  };

  const handleWhatsappPress = () => {
    const url = `https://wa.me/${item?.mobile}`; // WhatsApp URL scheme

    Linking.openURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url); // Open WhatsApp with the specified phone number
        } else {
          Alert.alert('Error', 'WhatsApp is not installed on your device.');
        }
      })
      .catch(err => console.error('Error opening WhatsApp:', err));
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      {/* Content Section */}
      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.column}>
          <Text style={styles.value}>
            Status:{' '}
            <Text style={{color: '#000', fontSize: 14, right: 40}}>
              {item.status ? item.status : '-'}
            </Text>
          </Text>
          <Text style={styles.createdAt}>
            Created At:{' '}
            <Text style={{color: '#000', fontSize: 14}}>
              {item.followup ? item.followup : new Date().toLocaleDateString()}
            </Text>
          </Text>
        </View>

        {/* Vertical Divider */}
        <View style={styles.divider} />

        {/* Right Section */}
        <View style={styles.column}>
          <Text style={styles.value}>
            SubStatus:{' '}
            <Text style={{color: '#000', fontSize: 14}}>
              {item.substatus ? item.substatus : '-'}
            </Text>
          </Text>
        </View>
      </View>
      <Text style={styles.value1}>
        Notes:{' '}
        <Text style={{color: '#000', fontSize: 14}}>
          {item?.notes ? item?.notes : '-'}
        </Text>
      </Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <Text style={styles.noDataText}>No Data Found</Text>
  );

  //console.log('notesssssssss  ', data);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.uppersection}>
        <View style={styles.leftSection}>
          <View>
            <Text style={styles.title}>{name ? name : '-'}</Text>
            <Text style={styles.subtitle}>CALL BACK</Text>
          </View>
          {/* <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={23} color="gray" />
          </TouchableOpacity> */}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCallPress}>
            <MaterialCommunityIcons name="phone" size={24} color="lightgreen" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.iconButton} onPress={handleSmsPress}>
            <MaterialCommunityIcons
              name="message-text"
              size={24}
              color="blue"
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleWhatsappPress}>
            <MaterialCommunityIcons name="whatsapp" size={24} color="green" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.card}>
        {/* Content Section */}
        <View style={styles.content}>
          {/* Left Section */}
          <View style={styles.column}>
            {/* <Text style={styles.text}>Location:</Text> */}
            {/* <Text style={styles.valuetext}>-</Text> */}
            <Text style={styles.text}>Country:</Text>
            <Text style={styles.valuetext}>India</Text>
            {/* <Text style={styles.text}>State:</Text> */}
            {/* <Text style={styles.valuetext}>-</Text> */}
            <Text style={styles.text}>City:</Text>
            <Text style={styles.valuetext}>{city ? city : '-'}</Text>
            <Text style={styles.text}>Property Stage:</Text>
            <Text style={styles.valuetext}>
              {property_stage ? property_stage : '-'}
            </Text>
            <Text style={styles.text}>Property Sub Type:</Text>
            <Text style={styles.valuetext}></Text>
            <Text style={styles.text}>Project:</Text>
            <Text style={styles.valuetext}>
              {project_name ? project_name : '-'}
            </Text>
          </View>

          {/* Vertical Divider */}
          <View style={styles.divider} />

          {/* Right Section */}
          <View style={styles.column}>
            <Text style={styles.textright}>Contact Number:</Text>
            <Text style={styles.valuetext1}>{mobile ? mobile : '-'}</Text>
            <Text style={styles.textright}>Budget:</Text>
            <Text style={styles.valuetext1}>{budget ? budget : '-'}</Text>
            <Text style={styles.textright}>Propety Type:</Text>
            <Text style={styles.valuetext1}>
              {property_type ? property_type : '-'}
            </Text>
            <Text style={styles.textright}>Lead Source:</Text>
            <Text style={styles.valuetext1}>{leadSource ? leadSource : "-"}</Text>
            <Text style={styles.textright}>Lead Type:</Text>
            <Text style={styles.valuetext1}>{leadType ? leadType : "-"}</Text>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonRow}>
          <TransparentButton
            text="Intrested"
            borderColor="green"
            textColor="green"
            onPress={() =>
              navigation.replace('InterestedDetails', {item: item,
                otherParam: leadType,
              })
            }
          />
          <TransparentButton
            text="Call Back"
            borderColor="#239999"
            textColor="#239999"
            onPress={() => navigation.replace('CallBackDetails', {item: item})}
          />
          <TransparentButton
            text="Not Intrested"
            borderColor="red"
            textColor="red"
            onPress={() => navigation.replace('NotIntrested', {item: item})}
          />
        </View>
      </View>
      <Text style={styles.titlenotes}>Activites</Text>
      <FlatList
        scrollEnabled={false}
        data={data}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
      />

      <Text style={styles.titlenotes}>Notes</Text>
      <View style={styles.card1}>
        {/* Input Field and Plus Button */}
        <View style={styles.inputRow}>
        <TextInput
        style={styles.input}
        placeholder="Enter your note"
        value={note}
        onChangeText={setNote}
        multiline
      />
          {/* <TouchableOpacity onPress={addNote} style={styles.addButton}>
            <MaterialCommunityIcons name="plus" size={24} color="yellow" />
          </TouchableOpacity> */}
        </View>

        {/* Notes List */}
        {/* <FlatList
          scrollEnabled={false}
          data={notes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <Text style={styles.note}>{item}</Text>}
        /> */}

        {/* Submit Notes Button */}
        <TouchableOpacity onPress={sendNotesToApi} style={styles.sendButton}>
          <Text style={styles.buttonText}>SAVE</Text>
        </TouchableOpacity>
        <Text
          style={{fontSize: 15, top: 16, color: 'green', fontWeight: '600'}}>
          All Notes
        </Text>
        <FlatList
          scrollEnabled={false}
          data={allNotes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Text style={styles.note1}>{item?.notes}</Text>
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  content: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  column: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    paddingHorizontal: 8,
  },
  divider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  buttonRow: {
    //flexDirection: "row",
    //justifyContent: "space-between",
    //marginTop: 66,
  },
  button: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  uppersection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    //marginVertical: 10,
    //padding: 16,
    //borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    //backgroundColor: "#fff",
  },
  leftSection: {
    flexDirection: 'row',
    //alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'green',
  },
  titlenotes: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'green',
    paddingLeft: 16,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  editButton: {
    marginLeft: 10,
    marginBottom: 20,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
  textright: {
    fontSize: 16,
    color: '#333',
    paddingLeft: 20,
  },
  valuetext: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    //textAlign: "center",
    marginVertical: 2,
    marginBottom: 4,
  },
  valuetext1: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    //textAlign: "center",
    marginVertical: 2,
    marginBottom: 4,
    paddingLeft: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    color: '#333',

    //
  },
  card1: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  title1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#0389ca',
  },
  value1: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#0389ca',
    paddingHorizontal: 10,
  },
  createdAt: {
    fontSize: 14,
    color: '#0389ca',
    //marginTop: 10,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    fontSize: 16,
    marginVertical: 10,
  },
  card1: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  iconButton1: {
    backgroundColor: '#007BFF',
    borderRadius: 16,
    padding: 8,
  },
  addNoteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  noteItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    padding: 7,
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  note: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  note1: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginTop: 20,
    //borderRadius: 5,
    //borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    backgroundColor: '#0389ca',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ContactDetails;
