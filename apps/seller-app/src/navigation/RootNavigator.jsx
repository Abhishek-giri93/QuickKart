// Seller App — Root Navigator

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '../store/authStore';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import StoreSetupScreen from '../screens/auth/StoreSetupScreen';

// Main Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import ProductsScreen from '../screens/products/ProductsScreen';
import AddProductScreen from '../screens/products/AddProductScreen';
import EditProductScreen from '../screens/products/EditProductScreen';
import EarningsScreen from '../screens/earnings/EarningsScreen';
import ProfileScreen from '../screens/dashboard/ProfileScreen';

import { SellerColors } from '../constants/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcon = (name, focused) => {
  const icons = {
    Dashboard: focused ? '📊' : '📈',
    Orders: focused ? '📦' : '📫',
    Products: focused ? '🏪' : '🛒',
    Earnings: focused ? '💰' : '💵',
  };
  return <Text style={{ fontSize: 22 }}>{icons[name]}</Text>;
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused }) => tabIcon(route.name, focused),
      tabBarActiveTintColor: SellerColors.primary,
      tabBarInactiveTintColor: SellerColors.text.tertiary,
      tabBarStyle: {
        backgroundColor: SellerColors.surface,
        borderTopColor: SellerColors.border,
        height: 60,
        paddingBottom: 8,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Orders" component={OrdersScreen} />
    <Tab.Screen name="Products" component={ProductsScreen} />
    <Tab.Screen name="Earnings" component={EarningsScreen} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="StoreSetup" component={StoreSetupScreen} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={MainTabs} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    <Stack.Screen name="AddProduct" component={AddProductScreen} />
    <Stack.Screen name="EditProduct" component={EditProductScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

const SellerRootNavigator = () => {
  const { isAuthenticated } = useAuthStore();
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default SellerRootNavigator;

