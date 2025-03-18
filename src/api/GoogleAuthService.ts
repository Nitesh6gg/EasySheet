
import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEB_CLIENT_ID, IOS_CLIENT_ID, ANDROID_CLIENT_ID } from '../config/googleConfig';
import { Platform } from 'react-native';

// Register for redirect URI
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate the redirect URI (use proxy on web if needed)
  const redirectUri = AuthSession.makeRedirectUri({
    native: Platform.select({
      android: 'com.easysheet:/oauth2redirect',
      ios: 'com.easysheet:/oauth2redirect',
      default: undefined,
    }),
    useProxy: Platform.OS === 'web' ? true : false,
  } as any);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    scopes: [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
    ],
    redirectUri,
  });

  // On mount, check for stored auth data
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('google_user_data');
        const storedToken = await AsyncStorage.getItem('google_access_token');
        if (storedUserData) {
          setUserInfo(JSON.parse(storedUserData));
        }
        if (storedToken) {
          setAccessToken(storedToken);
        }
      } catch (error) {
        console.error('Error checking existing auth:', error);
      }
    };
    checkUserAuth();
  }, []);

  useEffect(() => {
    console.log("Authentication response:", response);
    if (response?.type === 'success' && response.authentication?.accessToken) {
      const token = response.authentication.accessToken;
      console.log("Received access token:", token);
      setAccessToken(token);
      AsyncStorage.setItem('google_access_token', token);
      fetchUserInfo(token);
    } else if (response?.type === 'error') {
      console.log('Something went wrong with authentication');
    }
  }, [response]);

  const fetchUserInfo = async (token: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      console.log("Fetched user data:", user);
      setUserInfo(user);
      await AsyncStorage.setItem('google_user_data', JSON.stringify(user));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching user info:', error);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await promptAsync();
    } catch (error) {
      console.log('Error during sign in', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('google_user_data');
      await AsyncStorage.removeItem('google_access_token');
      setUserInfo(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { signInWithGoogle, signOut, userInfo, accessToken, loading, error };
};
