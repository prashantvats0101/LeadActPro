import {
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Button,
  View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator, 
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Search from './../../components/Search';
import CustomCard from './../../components/CustomCard';
import {IMAGE_PATH} from './../../constants/ImagePath';
import LeadCard from './../../components/LeadCards';
import CustomRow from './../../components/CustomRow';
import Geolocation from 'react-native-geolocation-service';
import {_get, _post} from './../../api/apiClient';
import {showMessage} from 'react-native-flash-message';
import DeviceInfo from 'react-native-device-info';
import {
  createNotificationChannel,
  getFcmToken,
  onMessageListener,
  requestUserPermission,
} from '../../utils/NotificationService';
import {getUserData} from '../../components/EncryptedStorageUtil';
import axios from 'axios';
//import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const items = [
  {id: '1', name: 'Alice Johnson', number: '123-456-7890'},
  {id: '2', name: 'Bob Smith', number: '987-654-3210'},
  {id: '3', name: 'Charlie Brown', number: '555-123-4567'},
  {id: '4', name: 'Diana Prince', number: '444-555-6666'},
];

const Home = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  //const navigation = useNavigation();
  const [userName, setUserName] = useState();
  const [address, setAddress] = useState(null);
  const [deviceName, setDeviceName] = useState('Fetching...');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [latitude, setLetitude] = useState('');
  const [logitude, setLongitude] = useState('');
  const [location, setLocation] = useState('');

  const [fcmtoken, setFcmToken] = useState('');
  //const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');


  // Debounce function
  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetchSearchResults();
      }
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://api.example.com/search?q=${searchQuery}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch results');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemPress = (item) => {
    navigation.navigate('DetailsScreen', { item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item)}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>{item.details}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    // Create the notification channel when the app starts
    createNotificationChannel();

    // Request user permission for notifications
    requestUserPermission();
    // Listen for foreground notifications
    const unsubscribe = onMessageListener(navigation);
    return () => {
      unsubscribe(); // Cleanup listener
    };
  }, [navigation]);

  useEffect(() => {
    // Set a timeout to update the message after 3 seconds
    const timeoutId = setTimeout(async () => {
      const fcmtoken = await getUserData('fcmToken');
      setFcmToken(fcmtoken);
    }, 3000);

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [fcmtoken]);

  useEffect(() => {
    const postData = async () => {
      const deviceName = await DeviceInfo.getDeviceName();
      setDeviceName(deviceName);
      const deviceType = DeviceInfo.getDeviceType();
      setDeviceType(deviceType);
      const deviceId = await DeviceInfo.getUniqueId();
      try {
        const data = {
          device_id: fcmtoken,
          device_name: deviceName,
          type: deviceType,
          env: 'dev',
        };
        const response = await _post('/add-device', data);
      } catch (error) {
        console.log('errorssss', error);
      }
    };
    postData();
  }, [fcmtoken]);

  useEffect(() => {
    requestLocationPermission();
    getProfile();
    getDevice();
    getDateAndTime();
    // const token = await getFcmToken()
    // setFcmToken(token);
    //postLoaction();
  }, []);

  const getDevice = async () => {
    if (DeviceInfo.getDeviceName) {
      const name = await DeviceInfo.getDeviceName();

      setDeviceName(name);
    } else {
      setDeviceName('Emulator/Simulator');
    }
  };

  const getDateAndTime = () => {
    const now = new Date();

    // Format the date and time
    const formattedDateTime = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
      now.getHours(),
    ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds(),
    ).padStart(2, '0')}`;

    setCurrentDateTime(formattedDateTime);
  };

  const getProfile = async () => {
    try {
      const response = await _get('/user-profile').then(response => {
        const {data, status} = response;

        const {name} = data.data; // Assuming the response format
        setUserName(name);
      });
    } catch (error) {
      console.error('API Error:sss', error);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        setLetitude(position?.coords?.latitude);
        setLongitude(position?.coords?.longitude);
        //postLoaction();
        //console.log(position);
      },
      error => {
        console.error(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const postLoaction = async () => {
    const formData = new FormData();
    formData.append('latitude', location?.coords?.latitude);
    formData.append('longitude', location?.coords?.longitude);
    //formData.append('address', address);
    formData.append('device_name', deviceName);
    formData.append('u_time', currentDateTime);
    console.log('datatata', latitude, logitude);
    const data = {
      latitude: latitude,
      longitude: logitude,
      device_name: deviceName,
      u_time: currentDateTime,
    };

    try {
      const response = await _post('/user-location', JSON.stringify(data));
      if (response.status == 200) {
      } else {
        showMessage(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('API Error:sss', error);
    }
  };


  return (
    <ScrollView>
      <CustomCard
        leftImage={IMAGE_PATH.AVTAR} // Replace with your image URL
        logoImage={IMAGE_PATH.LOGO} // Replace with your logo URL
        title={userName ? userName : '-'}
        subtitle=""
        style={{}}
      />
      
      <TouchableOpacity 
        style={styles.searchContainer}
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#777"
          editable={false} // Makes the TextInput non-editable
          pointerEvents="none" // Makes the TextInput non-interactive
        />
      </TouchableOpacity>
      {/* Rest of your home screen content */}
      <LeadCard onpress={() => {}} label={''} navigation={navigation} />
      <CustomRow
        title="Add Inventory"
        //onPress={() => alert('Menu Item 1 pressed')}
        backgroundColor="#ffffff"
      />
      <CustomRow
        title="Analytics"
        //onPress={() => alert('Menu Item 1 pressed')}
        backgroundColor="#ffffff"
      />
      <CustomRow
        title="Request"
        //onPress={() => alert('Menu Item 1 pressed')}
        backgroundColor="#ffffff"
      />
      <CustomRow
        title="My Incentive"
        //onPress={() => alert('Menu Item 1 pressed')}
        backgroundColor="#ffffff"
      />
      <CustomRow
        title="Appraisal"
        //onPress={() => alert('Menu Item 1 pressed')}
        backgroundColor="#ffffff"
      />
      <CustomRow
        title="Booking"
        //onPress={() => alert('Menu Item 1 pressed')}
        backgroundColor="#ffffff"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    marginVertical:8,
    marginHorizontal: 10,
    elevation: 2,
    padding:4
  },

  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemNumber: {
    fontSize: 16,
    color: '#666',
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Home;
