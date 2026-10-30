// Customer App — Cart Stack Navigator

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';
import AddressScreen from '../screens/cart/AddressScreen';
import PaymentScreen from '../screens/cart/PaymentScreen';
import OrderConfirmationScreen from '../screens/orders/OrderConfirmationScreen';
import { CustomerColors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const CartNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: CustomerColors.surface },
        headerTintColor: CustomerColors.text.primary,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'My Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen name="Address" component={AddressScreen} options={{ title: 'Delivery Address' }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default CartNavigator;

