import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {FAB, Provider as PaperProvider} from 'react-native-paper';
import {_get} from '../../api/apiClient';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const FollowUp = React.lazy(() => import('./FollowUp'));
const SiteVisit = React.lazy(() => import('./SiteVisit'));
const Meeting = React.lazy(() => import('./Meeting'));
const All = React.lazy(() => import('./All'));

const InterestedLead = ({navigation}) => {

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
          //tabBarItemStyle: { width: 100 },
          tabBarStyle: { backgroundColor: '#fff' },
          tabBarIndicatorStyle: { backgroundColor: 'blue' },
        }}
      >
        <Tab.Screen name="All">{() => (
          <React.Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
              <All navigation={navigation}/>
            </React.Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen name="FollowUp">
          {() => (
            <React.Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
              <FollowUp navigation={navigation}/>
            </React.Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen name="SiteVisit">
          {() => (
            <React.Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
              <SiteVisit navigation={navigation}/>
            </React.Suspense>
          )}
        </Tab.Screen>
        <Tab.Screen name="Meeting">
          {() => (
            <React.Suspense fallback={<View style={styles.loadingContainer}><Text>Loading...</Text></View>}>
              <Meeting navigation={navigation}/>
            </React.Suspense>
          )}
        </Tab.Screen>
      </Tab.Navigator>
      <View>
     <PaperProvider>
        <FAB
          style={styles.fab}
          icon="plus"
          color="#ffffff"
          onPress={() => navigation.navigate('AddContact')}
        />
      </PaperProvider>
      </View>
    </View>
  );
};

export default InterestedLead;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    borderRadius: 50,
  },
});
