// Customer App — Orders Stack Navigator

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';
import LiveTrackingScreen from '../screens/orders/LiveTrackingScreen';
import ReviewScreen from '../screens/orders/ReviewScreen';
import { CustomerColors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const OrdersNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: CustomerColors.surface },
        headerTintColor: CustomerColors.text.primary,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Order Details' }} />
      <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} options={{ title: 'Track Order' }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Rate & Review' }} />
    </Stack.Navigator>
  );
};

export default OrdersNavigator;

