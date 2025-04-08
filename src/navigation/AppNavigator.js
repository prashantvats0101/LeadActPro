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
  SearchScreen,
} from './../screens/index';
import TabRoute from './TabRoute';
import NavigationService from './NavigationService';
import Search from '../components/Search';

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
      <Stack.Screen name="AddContact" options={{ title: "Add Contact" }} component={AddContact} />
      <Stack.Screen name="InterestedDetails" options={{ title: "Interested Details" }} component={InterestedDetails} />
      <Stack.Screen name="NotIntrested" options={{ title: "Not Intrested" }} component={NotIntrested} />
      <Stack.Screen name="CallBackDetails" options={{ title: "CallBack Details" }} component={CallBackDetails} />
      <Stack.Screen name="CreateTask" options={{ title: "Create Task" }} component={CreateTask} />
      <Stack.Screen name="WonDetails" options={{ title: "Won Details" }} component={WonDetails} />
      <Stack.Screen name="RescheduleTask" options={{ title: "Reschedule Task" }} component={RescheduleTask} />
      <Stack.Screen name="LostDetails" options={{ title: "Lost Details" }} component={LostDetails} />
      <Stack.Screen name="ContactDetails" options={{ title: "Contact Details" }} component={ContactDetails} />
      <Stack.Screen name="InterestedLead" options={{ title: "Interested Lead" }} component={InterestedLead} />
      <Stack.Screen name="LeadInterested" options={{ title: "Lead Interested" }} component={LeadInterested} />
      <Stack.Screen name="NotIntrestedLead" options={{ title: "NotIntrested Lead" }} component={NotIntrestedLead} />
      <Stack.Screen name="CallBackLead" options={{ title: "CallBack Lead" }} component={CallBackLead} />
      <Stack.Screen name="PendingLead" options={{ title: "Fresh" }} component={PendingLead} />
      <Stack.Screen name="Opportunity" component={Opportunity} />
      <Stack.Screen name="MissedLead" options={{ title: "Missed Lead" }} component={MissedLead} />
      <Stack.Screen name="WonLead" options={{ title: "Won Lead" }} component={WonLead} />
      <Stack.Screen name="NotificationContactDetails" component={NotificationContactDetails} />
      <Stack.Screen options={{ headerShown:false, animationEnabled: true }}name="SearchScreen" component={SearchScreen} />
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
