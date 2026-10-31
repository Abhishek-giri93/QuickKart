// Customer App — Main Navigator (Bottom Tab + Stack)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeNavigator from './HomeNavigator';
import SearchNavigator from './SearchNavigator';
import CartNavigator from './CartNavigator';
import OrdersNavigator from './OrdersNavigator';
import ProfileNavigator from './ProfileNavigator';
import { CustomerColors } from '../constants/colors';

const Tab = createBottomTabNavigator();

const tabIcon = (name, focused) => {
  const icons = {
    Home: focused ? '🏠' : '🏡',
    Search: focused ? '🔍' : '🔎',
    Cart: focused ? '🛒' : '🛍️',
    Orders: focused ? '📦' : '📫',
    Profile: focused ? '👤' : '👥',
  };
  return <Text style={{ fontSize: 22 }}>{icons[name]}</Text>;
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => tabIcon(route.name, focused),
        tabBarActiveTintColor: CustomerColors.primary,
        tabBarInactiveTintColor: CustomerColors.text.tertiary,
        tabBarStyle: {
          backgroundColor: CustomerColors.surface,
          borderTopColor: CustomerColors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Search" component={SearchNavigator} />
      <Tab.Screen name="Cart" component={CartNavigator} />
      <Tab.Screen name="Orders" component={OrdersNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;

