import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MoodEntry } from '../types';
import axiosInstance from '../utils/axiosInstance';
import { useRouter } from 'expo-router'; // ✅ Added

export default function HomeScreen() {
  const { token, logout } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ Added

  const fetchMoods = async () => {
    try {
      const res = await axiosInstance.get('/api/moods', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMoods(res.data);
    } catch (err) {
      console.error('Failed to fetch moods:', err);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        '/api/moods',
        { text: message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMoods((prev) => [res.data, ...prev]);
      setMessage('');
    } catch (err) {
      console.error('Failed to send mood:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout(); // ✅ Clears token
    router.replace('/login'); // ✅ Redirects to login
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={60}
      >
        <Text style={styles.title}>Welcome Back 👋</Text>

        <ScrollView contentContainerStyle={styles.scroll}>
          {moods.map((entry, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.mood}>{entry.mood}</Text>
              <Text style={styles.text}>{entry.text}</Text>
              <Text style={styles.date}>
                {new Date(entry.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="How are you feeling today?"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            {loading ? (
              <ActivityIndicator color="#2575fc" />
            ) : (
              <Text style={styles.sendText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 24 },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scroll: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  mood: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  text: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
  date: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendText: {
    color: '#2575fc',
    fontWeight: 'bold',
  },
  logout: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});