// UpdateSheetExample.tsx
import React, { useState } from 'react';
import { Button, View, Text, StyleSheet, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';

// --- Configuration ---
// Your Google OAuth2 client ID (Web or iOS/Android client ID)
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
// The scopes we need for editing a sheet (this one gives full spreadsheet access)
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// Your spreadsheet ID from the Google Sheets URL
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
// Generate a redirect URI for Expo (you can customize the scheme if needed)
const REDIRECT_URI = AuthSession.makeRedirectUri({
  // For example, if you have a custom scheme defined in app.json, include it here.
  // native: 'your.app://redirect'
});

const UpdateSheetExample: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [updateResponse, setUpdateResponse] = useState<any>(null);

  // Step 1: Sign in with Google to obtain an access token.
  const signInWithGoogle = async () => {
    try {
      // Construct the Google OAuth2 authorization URL.
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&response_type=token&scope=${encodeURIComponent(SCOPES.join(' '))}&prompt=consent`;

      // Launch the authentication flow.
      const result = await AuthSession.startAsync({ authUrl });

      if (result.type === 'success' && result.params.access_token) {
        setAccessToken(result.params.access_token);
      } else {
        Alert.alert('Authentication canceled or failed');
      }
    } catch (error) {
      console.error('Error during Google sign in:', error);
      Alert.alert('Sign in error', error.message);
    }
  };

  // Step 2: Update the Google Sheet using the access token.
  const updateSheetValues = async () => {
    if (!accessToken) {
      Alert.alert('Please sign in first');
      return;
    }

    // Define the range and new values you want to update.
    const range = 'Sheet1!A2:C2'; // For example, updating row 2 (columns A to C)
    const newValues = [
      ['123', 'John Doe', 'john@example.com'] // 2D array: one row with three columns
    ];

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=USER_ENTERED`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          range,
          majorDimension: "ROWS",
          values: newValues,
        }),
      });

      const data = await response.json();
      setUpdateResponse(data);
      Alert.alert('Sheet updated successfully!');
    } catch (error) {
      console.error("Error updating sheet:", error);
      Alert.alert("Update error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Google Sheet Example</Text>
      <Button title="Sign In with Google" onPress={signInWithGoogle} />
      {accessToken && (
        <Text style={styles.tokenText}>
          Access Token: {accessToken.substring(0, 20)}...
        </Text>
      )}
      <View style={styles.buttonSpacing}>
        <Button title="Update Sheet" onPress={updateSheetValues} />
      </View>
      {updateResponse && (
        <Text style={styles.responseText}>
          Response: {JSON.stringify(updateResponse)}
        </Text>
      )}
    </View>
  );
};

export default UpdateSheetExample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  tokenText: {
    marginVertical: 10,
    fontSize: 12,
    color: '#555',
  },
  buttonSpacing: {
    marginVertical: 15,
  },
  responseText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
});
