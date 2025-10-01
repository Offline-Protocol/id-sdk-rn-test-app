import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@offline-protocol/id-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { sendCode, verifyCode } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [phase, setPhase] = useState<'request' | 'verify'>('request');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRequest = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const ok = await sendCode(email.trim());
      if (ok) setPhase('verify');
      else setError('Failed to send code');
    } catch (e) {
      setError('Failed to send code');
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const user = await verifyCode(email.trim(), code.trim());
      if (user) {
        if (user.username) router.replace('/guard');
        else router.replace('/(auth)/complete-profile');
      } else {
        setError('Invalid code');
      }
    } catch (e) {
      setError('Invalid code');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Sign in to Offline ID</ThemedText>
      {phase === 'request' ? (
        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} disabled={!email || submitting} onPress={onRequest}>
            {submitting ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Send Code</ThemedText>}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <ThemedText>We sent a 6-digit code to {email}</ThemedText>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter code"
            keyboardType="number-pad"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} disabled={!code || submitting} onPress={onVerify}>
            {submitting ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Verify</ThemedText>}
          </TouchableOpacity>
        </View>
      )}
      {!!error && <ThemedText style={{ color: 'red', marginTop: 8 }}>{error}</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    gap: 16,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
  },
  button: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});


