import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { SpreadsheetProvider } from '@/src/context/SpreadsheetContext';

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <SpreadsheetProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="login" component={} />
          <Stack.Screen name="delivery" component={delivery} /> */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </SpreadsheetProvider>
  );

}
