// app/_layout.tsx
import { Stack } from 'expo-router';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function Layout() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

function AuthWrapper() {
  const { authToken } = useContext(AuthContext);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {authToken ? (
        <Stack.Screen name="index" /> // Home
      ) : (
        <Stack.Screen name="login" />
      )}
    </Stack>
  );
}