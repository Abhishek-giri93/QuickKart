// Delivery App — Root Navigator

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '../store/authStore';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';

// Main Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ActiveDeliveryScreen from '../screens/delivery/ActiveDeliveryScreen';
import DeliveryOTPScreen from '../screens/delivery/DeliveryOTPScreen';
import DeliveryHistoryScreen from '../screens/delivery/DeliveryHistoryScreen';
import EarningsScreen from '../screens/earnings/EarningsScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';

import { DeliveryColors } from '../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcon = (name, focused) => {
  const icons = {
    Dashboard: focused ? '🚴' : '🛵',
    History: focused ? '📋' : '📃',
    Earnings: focused ? '💰' : '💵',
    Profile: focused ? '👤' : '👥',
  };
  return <Text style={{ fontSize: 22 }}>{icons[name]}</Text>;
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused }) => tabIcon(route.name, focused),
      tabBarActiveTintColor: DeliveryColors.primary,
      tabBarInactiveTintColor: DeliveryColors.text.tertiary,
      tabBarStyle: {
        backgroundColor: DeliveryColors.surface,
        borderTopColor: DeliveryColors.border,
        height: 60,
        paddingBottom: 8,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="History" component={DeliveryHistoryScreen} />
    <Tab.Screen name="Earnings" component={EarningsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Verification" component={VerificationScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={MainTabs} />
    <Stack.Screen name="ActiveDelivery" component={ActiveDeliveryScreen} />
    <Stack.Screen name="DeliveryOTP" component={DeliveryOTPScreen} />
  </Stack.Navigator>
);

const DeliveryRootNavigator = () => {
  const { isAuthenticated } = useAuthStore();
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default DeliveryRootNavigator;

