import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@offline-protocol/id-react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function CompleteProfileScreen() {
  const { user, isUsernameAvailable, registerUsername, refreshUser } = useAuth();
  const [username, setUsername] = useState('');
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.username) router.replace('/guard');
  }, [user?.username]);

  const check = async (name: string) => {
    setChecking(true);
    try {
      const ok = await isUsernameAvailable(name);
      setAvailable(ok);
    } finally {
      setChecking(false);
    }
  };

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await registerUsername(username.trim());
      if (res) {
        await refreshUser();
        router.replace('/guard');
      }
    } catch (e) {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Choose your username</ThemedText>
      <View style={styles.form}>
        <TextInput
          placeholder="username"
          autoCapitalize="none"
          value={username}
          onChangeText={(t) => {
            setUsername(t);
            if (t.length >= 3) check(t);
            else setAvailable(null);
          }}
          style={styles.input}
        />
        {available === true && <ThemedText style={{ color: 'green' }}>Available</ThemedText>}
        {available === false && <ThemedText style={{ color: 'red' }}>Not available</ThemedText>}
        <TouchableOpacity
          style={[styles.button, { opacity: !available || username.length < 3 || saving ? 0.6 : 1 }]}
          disabled={!available || username.length < 3 || saving}
          onPress={onSave}
        >
          <ThemedText style={styles.buttonText}>{saving ? 'Saving…' : 'Continue'}</ThemedText>
        </TouchableOpacity>
        {!!error && <ThemedText style={{ color: 'red' }}>{error}</ThemedText>}
      </View>
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


