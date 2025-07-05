import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import navigators
import BottomNavigation from './BottomNavigation';

// Import screens
import CreateStoryScreen from '../screens/CreateStoryScreen';
import QuestionSelectionScreen from '../screens/QuestionSelectionScreen';
import RecordVideoScreen from '../screens/RecordVideoScreen';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: '#000' }
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Main App Stack
const MainStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: '#000' }
    }}
  >
    <Stack.Screen name="MainTabs" component={BottomNavigation} />
    <Stack.Screen name="CreateStory" component={CreateStoryScreen} />
    <Stack.Screen name="QuestionSelection" component={QuestionSelectionScreen} />
    <Stack.Screen name="RecordVideo" component={RecordVideoScreen} />
  </Stack.Navigator>
);

export default function Navigation() {
  // For demo purposes, we'll show the main app
  // In a real app, you'd have authentication state management
  const isAuthenticated = true;

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#000" />
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}