import messaging from '@react-native-firebase/messaging';
// import { useNavigation } from '@react-navigation/native';
import {Alert} from 'react-native';
import NavigationService from '../navigation/NavigationService';
//import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import {storeUserData} from '../components/EncryptedStorageUtil';
import notifee, {AndroidImportance} from '@notifee/react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
}

const getFcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    storeUserData('fcmToken', fcmToken);
  } catch (error) {
    console.log('error in creating token');
  }
  return fcmToken;
};

// Create a notification channel (required for Android 8.0+)
const createNotificationChannel = async () => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });
};

// Display a notification
const displayNotification = async (title, body, data) => {
  await notifee.displayNotification({
    title: title,
    body: body,
    data: data, // Pass custom data to handle navigation
    android: {
      channelId: 'default', // Use the channel ID created above
      pressAction: {
        id: 'default',
      },
    },
  });
};

// Listen for foreground notifications
const onMessageListener = navigation => {
  return messaging().onMessage(async remoteMessage => {
    console.log('Foreground Notification:', remoteMessage);

    // Display the notification in the notification panel
    await displayNotification(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
      remoteMessage.data, // Pass data for navigation
    );
    notifee.onForegroundEvent(({type, detail}) => {
      if (type == 1) {
        const {screen, id} = detail.notification.data;

        if (screen) {
          const item = {
            id: id,
          };
          navigation.navigate(screen, {item: item}); // Navigate to the specified screen
        }
      }
    });
  });
};

export async function notificationListeners() {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    const item = {
      id: remoteMessage?.data?.id,
    };
    NavigationService.navigate('ContactDetails', {item: item});
  });

  messaging()
    .getInitialNotification()
    .then(resolve => {
      if (resolve != null) {
        const {screen, id} = resolve.data;
        const item = {
          id: id,
        };
        resolve.then(() => {
          setTimeout(() => {
            NavigationService.navigate(screen, {item: item});
          }, 5000);
        });

        setTimeout(() => {
          NavigationService.navigate(screen, {item: item});
        }, 5000);
        NavigationService.navigate(screen, {item: item});
      } else {
        // console.log('something went wrong, please try later!');
      }
    });
  return unsubscribe;
}

export {
  getFcmToken,
  createNotificationChannel,
  displayNotification,
  onMessageListener,
};
