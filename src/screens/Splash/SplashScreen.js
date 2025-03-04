import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {getUserData} from './../../components/EncryptedStorageUtil';
import FastImage from 'react-native-fast-image';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const checkUserToken = async () => {
        const token = await getUserData('userToken');
        if (token) {
          navigation.replace('Home');
        } else {
          navigation.navigate('Login');
        }
      };
      checkUserToken();
    },);
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.logo}
        source={require('./../../assets/images/Splash.gif')}
        //resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#fff",
  },
  logo: {
    flex: 1,
    // width: 150,
    // height: 150,
    // marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SplashScreen;
