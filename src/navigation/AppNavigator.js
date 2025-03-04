import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  Splash,
  Login,
  Contact,
  AddContact,
  InterestedDetails,
  NotIntrested,
  CallBackDetails,
  CreateTask,
  RescheduleTask,
  LostDetails,
  ContactDetails,
  InterestedLead,
  LeadInterested,
  NotIntrestedLead,
  CallBackLead,
  PendingLead,
  Opportunity,
  WonDetails,
  MissedLead,
  WonLead,
  NotificationContactDetails,
} from './../screens/index';
import TabRoute from './TabRoute';
import NavigationService from './NavigationService';

const Stack = createStackNavigator();

const AuthStack = ({navigation, route}) => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerMode: 'screen',
        // headerStyle: {
        //   backgroundColor: 'green', // Customize header background
        // },
      }}>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        screenOptions={{headerTitleAlign: 'left'}}
        options={{headerShown: false}}
        name="Home"
        component={TabRoute}
      />
      <Stack.Screen name="Contact" component={Contact} />
      <Stack.Screen name="AddContact" component={AddContact} />
      <Stack.Screen name="InterestedDetails" component={InterestedDetails} />
      <Stack.Screen name="NotIntrested" component={NotIntrested} />
      <Stack.Screen name="CallBackDetails" component={CallBackDetails} />
      <Stack.Screen name="CreateTask" component={CreateTask} />
      <Stack.Screen name="WonDetails" component={WonDetails} />
      <Stack.Screen name="RescheduleTask" component={RescheduleTask} />
      <Stack.Screen name="LostDetails" component={LostDetails} />
      <Stack.Screen name="ContactDetails" component={ContactDetails} />
      <Stack.Screen name="InterestedLead" component={InterestedLead} />
      <Stack.Screen name="LeadInterested" component={LeadInterested} />
      <Stack.Screen name="NotIntrestedLead" component={NotIntrestedLead} />
      <Stack.Screen name="CallBackLead" component={CallBackLead} />
      <Stack.Screen name="PendingLead" component={PendingLead} />
      <Stack.Screen name="Opportunity" component={Opportunity} />
      <Stack.Screen name="MissedLead" component={MissedLead} />
      <Stack.Screen name="WonLead" component={WonLead} />
      <Stack.Screen name="NotificationContactDetails" component={NotificationContactDetails} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer ref={(ref) => NavigationService.setTopLevelNavigator(ref)}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
