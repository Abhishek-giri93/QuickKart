// Customer App — Home Stack Navigator

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import StoreListScreen from '../screens/home/StoreListScreen';
import StoreDetailScreen from '../screens/home/StoreDetailScreen';
import ProductListScreen from '../screens/product/ProductListScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import { CustomerColors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: CustomerColors.surface },
        headerTintColor: CustomerColors.text.primary,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="StoreList" component={StoreListScreen} options={{ title: 'Nearby Stores' }} />
      <Stack.Screen name="StoreDetail" component={StoreDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

