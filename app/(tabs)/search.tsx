import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useConnections, useProfiles } from '@offline-protocol/id-react-native';
import { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const { profiles } = useProfiles();
  const { addConnection } = useConnections();
  const [query, setQuery] = useState('');
  const filtered = profiles.filter((p) => p.username.toLowerCase().includes(query.toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
      <TextInput
        placeholder="Search username"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        style={styles.input}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold">@{item.username}</ThemedText>
              {!!item.about && <ThemedText>{item.about}</ThemedText>}
            </View>
            <TouchableOpacity style={styles.button} onPress={() => addConnection(item.username)}>
              <ThemedText style={styles.buttonText}>Connect</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonText: { color: '#fff' },
});


