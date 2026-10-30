// Customer App — Profile Navigator

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import WishlistScreen from '../screens/profile/WishlistScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import SupportScreen from '../screens/profile/SupportScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import { CustomerColors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: CustomerColors.surface },
        headerTintColor: CustomerColors.text.primary,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'Wishlist' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Help & Support' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;

