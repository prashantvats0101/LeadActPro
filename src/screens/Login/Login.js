import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import CustomButton from '../../components/CustomButton';
import FlashMessageComponent, {
  showSuccess,
  showError,
} from './../../components/FlashMessage';
import {showMessage} from 'react-native-flash-message';
import {useDispatch, useSelector} from 'react-redux';
import {_post} from './../../api/apiClient';
import {storeUserData} from '../../components/EncryptedStorageUtil';
import DeviceInfo from 'react-native-device-info';

const Login = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('sikarwarnandini284@gmail.com'); // aman@iminate.com
  const [password, setPassword] = useState('12345678'); // Aman@123
  const dispatch = useDispatch();
  const {loading, error} = useSelector(state => state.auth);
  const [token, setToken] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: null,
    deviceName: null,
    deviceType: null,
  });
  const [deviceName, setDeviceName] = useState('Fetching...');
  const [deviceType, setDeviceType] = useState('');
  

  useEffect(() => {
    // Fetch device information
    const fetchDeviceInfo = async () => {
      const deviceId = DeviceInfo.osBuildId || 'Unavailable';
      const deviceName = DeviceInfo.brand || 'Unavailable';
      const deviceType = DeviceInfo.model[DeviceInfo.model] || 'Unknown';

      setDeviceInfo({
        deviceId,
        deviceName,
        deviceType,
      });
    };

    fetchDeviceInfo();
  }, []);

  const addDevice = async () => {
    const fcmtoken = await getUserData('fcmToken');
    console.log('fcmtoken hereeeeeeee', fcmtoken);
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
        console.log('dataaaaaaaa', data);
        const response = await _post('/add-device', data);
        console.log('responsessss', response);
      } catch (error) {
        console.log('errorssss', error);
      }
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!email || email.trim() === '') {
      showError('Email can not be empty');
      return;
    }

    if (!password || password.trim() === '') {
      showError('Password cannot be empty');
      return;
    }

    setIsLoading(true);

    const data = {
      email: email,
      password: password,
    };
    try {
      const response = await _post('/login', data);
      const userToken = response.data.access_token;
      // Handle API response
      if (response.status == 200) {
        setToken(response.data.access_token);
        storeUserData('userToken', userToken);
        addDevice();
        showSuccess('Login Sucessful');
        navigation.replace('Home');
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <CustomButton
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        isLoading={isLoading}
        disabled={false}
        textStyle={{fontSize: 18}}
      />
      <FlashMessageComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Login;
