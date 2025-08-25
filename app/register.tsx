import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import axiosInstance from '../utils/axiosInstance';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setErrorMsg('');

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await axiosInstance.post('/api/register', {
        email,
        password,
      });

      const { token } = res.data;
      if (token) {
        await login(token);
        router.replace('/');
      } else {
        setErrorMsg('No token received. Try logging in.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(
        err.response?.data?.error || 'Network error. Please check your connection.'
      );
    }
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.gradient}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={60}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#ccc"
              style={[
                styles.input,
                emailError ? { borderColor: '#ff6666' } : {},
              ]}
              onChangeText={(text) => {
                setEmail(text);
                if (text) setEmailError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}

            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              style={[
                styles.input,
                passwordError ? { borderColor: '#ff6666' } : {},
              ]}
              secureTextEntry
              onChangeText={(text) => {
                setPassword(text);
                if (text) setPasswordError('');
              }}
            />
            {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 24 },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  fieldError: {
    color: '#ffdddd',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#2575fc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  error: {
    color: '#ffdddd',
    marginBottom: 12,
    textAlign: 'center',
  },
});