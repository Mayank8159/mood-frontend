// app/index.tsx
import { View, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View>
      {/* Mood tracking UI here */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}