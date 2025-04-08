import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from 'react-native';
import axios from 'axios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {_get} from '../../api/apiClient';
import LeadCardContact from '../../components/LeadCardContact';

// Search Screen
const SearchScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const searchInputRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      const timeout = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100); // Small delay for transition animation
      
      return () => clearTimeout(timeout);
    }, [])
  );

  // Focus input when screen loads
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      searchInputRef.current?.focus();
    });
    return unsubscribe;
  }, [navigation]);

  // Debounce search API call
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearchResults();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await _get(
        `https://leadactpro.in/api/api/searchleads?query=${searchQuery}`,
      );
      setResults(response.data.leads);
    } catch (err) {
      setError('Failed to fetch results');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemPress = item => {
    navigation.navigate('DetailScreen', {item});
  };

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

  const renderItem = ({item}) => (
    <View style={{flex: 1,marginHorizontal:10}}>
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

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>

        {/* <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          autoFocus
        /> */}
        <TextInput
          ref={searchInputRef}
          style={styles.searchInputActive}
          placeholder="Search..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          autoFocus={true} // Fallback auto-focus
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery ? 'No results found' : 'Start typing to search'}
            </Text>
          }
        />
      )}
    </View>
  );
};

// Detail Screen
const DetailScreen = ({route}) => {
  const {item} = route.params;

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{item.name}</Text>
      <Text style={styles.detailText}>{item.description}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    margin: 16,
  },
  searchPlaceholder: {
    color: '#777',
    marginLeft: 8,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  listItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  detailContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchScreen;
