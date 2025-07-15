import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, StatusBar as RNStatusBar } from 'react-native';

// Import navigators
import BottomNavigation from './BottomNavigation';

// Import screens
import CreateStoryScreen from '../screens/CreateStoryScreen';
import QuestionSelectionScreen from '../screens/QuestionSelectionScreen';
import RecordVideoScreen from '../screens/RecordVideoScreen';
import EditStoryScreen from '../screens/EditStoryScreen'; 
import EditProfileScreen from '../screens/EditProfileScreen';
import SavedStoriesScreen from '../screens/SavedStoriesScreen';
import ActivityScreen from '../screens/ActivityScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: '#000' },
      contentStyle: { 
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0
      }
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
      cardStyle: { backgroundColor: '#000' },
      contentStyle: { 
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0
      }
    }}
  >
    <Stack.Screen name="MainTabs" component={BottomNavigation} />
    <Stack.Screen name="CreateStory" component={CreateStoryScreen} />
    <Stack.Screen name="QuestionSelection" component={QuestionSelectionScreen} />
    <Stack.Screen name="RecordVideo" component={RecordVideoScreen} />
    <Stack.Screen name="EditStory" component={EditStoryScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="SavedStories" component={SavedStoriesScreen} />
    <Stack.Screen name="Activity" component={ActivityScreen} />
    <Stack.Screen name="Analytics" component={AnalyticsScreen} />
  </Stack.Navigator>
);

export default function Navigation() {
  // For demo purposes, we'll show the main app
  // In a real app, you'd have authentication state management
  const isAuthenticated = true;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" translucent={false} />
        {isAuthenticated ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}