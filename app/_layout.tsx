import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import {delivery} from 'delivery/index';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

 /* useEffect(() => {
    const checkAuth = async () => {
      try {

        // const token = await AsyncStorage.getItem('authToken');
        const token=false;
        if (token) {
          setIsAuthenticated(true);
          router.replace('/home'); // Redirect to home if logged in
        } else {
          setIsAuthenticated(false);
          router.replace('../'); // Redirect to login if not authenticated
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }*/

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/*<Stack.Screen name="login" component= {}/>
      <Stack.Screen name="delivery" component={delivery} />*/}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
