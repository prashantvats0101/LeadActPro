import {useNavigation} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';

/**
 * Save user data securely in SecureStore.
 * @param {string} key - The key to identify the stored value.
 * @param {object} value - The value to be stored.
 * @returns {Promise<void>}
 */
export const storeUserData = async (key, value) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
    console.log('Data successfully stored!');
  } catch (error) {
    console.error('Failed to store data', error);
  }
};

/**
 * Retrieve user data securely from SecureStore.
 * @param {string} key - The key to identify the stored value.
 * @returns {Promise<object|null>}
 */
export const getUserData = async key => {
  try {
    const data = await EncryptedStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to retrieve data', error);
    return null;
  }
};

/**
 * Clear a specific user data value from SecureStore.
 * @param {string} key - The key to identify the stored value.
 * @returns {Promise<void>}
 */
export const clearUserData = async key => {
  const navigation = useNavigation();
  try {
    await EncryptedStorage.removeItem(key);
    console.log('Data successfully cleared!');
    navigation.replace('Login');
  } catch (error) {
    console.error('Failed to clear data', error);
  }
};

export async function clearStorage(navigate) {
  try {
    await EncryptedStorage.clear();
    navigate();
  } catch (error) {
    console.log('error in clear storage', error);
  }
}
