import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import LeadCardContact from './../../components/LeadCardContact';
import {FAB, Provider as PaperProvider} from 'react-native-paper';
import {_get} from '../../api/apiClient';
import {useFocusEffect} from '@react-navigation/native';

const PendingLead = ({navigation}) => {
  const [data, setData] = useState({data: []}); // Initialize with a default structure
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const onRefreshh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await _post('/getpendingleads');
      //console.log("API Response:", response);
      const result = response?.data;
      if (result) {
        setData(result);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      // console.error("API Error:", error);
      // Alert.alert("Error", "Something went wrong, please try again.");
      //showError('Something went wrong, please try again');
    } finally {
      //setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const response = await _get('/getpendingleads');
      const result = response?.data;
      if (result) {
        setData(result);
      } else {
        showError('No data found.');
      }
    } catch (error) {
      console.error('API Error:', error);
      //Alert.alert('Error', 'Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSmsPress = item => {
    const mobile = item?.mobile;

    const url = `sms:${mobile}`; // Using the "sms:" protocol
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

  const handleWhatsappPress = item => {
    const mobile = item?.mobile;
    const url = `https://wa.me/${mobile}`; // WhatsApp URL scheme

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

  const renderItem = ({item}) => {
    return (
      <View style={{flex: 1}}>
        <LeadCardContact
          title={item?.name || 'Unknown'}
          subtitle={item?.email || '-'}
          mobile={item?.mobile}
          source={item?.source || '-'}
          oncardPress={() => {
            navigation.replace('ContactDetails', {
              item: item,
            });
          }}
          onCallPress={() => handleCallPress(item)} // Wrap in an anonymous function
          onSmsPress={() => handleSmsPress(item)}
          onWhatsappPress={() => handleWhatsappPress(item)}
        />
      </View>
    );
  };

  const handleCallPress = item => {
    const mobile = item?.mobile;
    Linking.openURL(`tel:${mobile}`)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          Linking.openURL(mobile);
          navigation.push('ContactDetails', {
            item: item,
          });
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#239999" />
        </View>
      ) : (
        <FlatList
          data={data?.data} // Use the fetched data
          refreshing={refreshing}
          extraData={data.data}
          onRefresh={onRefreshh}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            !isLoading && (
              <Text style={styles.emptyText}>No Pending leads found.</Text>
            )
          }
        />
      )}

      <PaperProvider>
        <FAB
          style={styles.fab}
          icon="plus"
          color="#ffffff"
          onPress={() => navigation.navigate('AddContact')}
        />
      </PaperProvider>
    </View>
  );
};

export default PendingLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    borderRadius: 50,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
