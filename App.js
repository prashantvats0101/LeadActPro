import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  PermissionsAndroid,
  alert,
  Platform,
} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {_post} from './src/api/apiClient';
import {
  notificationListeners,
  requestUserPermission,
} from './src/utils/NotificationService';

const App = () => {
  useEffect(() => {
    if (Platform.OS == 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then(res => {
          if (!!res && res == 'granted') {
            requestUserPermission();
            notificationListeners();
          }
        })
        .catch(error => {
          alert('something wrong');
        });
    } else {
    }
  });

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor="#0389ca" />
      <SafeAreaProvider>
        <SafeAreaView
          edges={['top']}
          style={{flex: 1, backgroundColor: '#0389ca'}}>
          <FlashMessage position="top" />
          <View style={styles.container}>
            <AppNavigator />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
