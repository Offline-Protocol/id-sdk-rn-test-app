import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useConnections } from '@offline-protocol/id-react-native';
// removed Identicon package
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConnectionsScreen() {
  const { connections, removeConnection } = useConnections();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <FlatList
          data={connections}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<ThemedText>No connections yet</ThemedText>}
          renderItem={({ item }) => {
            const peer = item.peer;
            return (
              <View style={styles.row}>
                <View style={styles.leftCluster}>
                  <View style={styles.circleIcon}>
                    <IconSymbol name="dot.radiowaves.left.and.right" size={18} color="#0a7ea4" />
                  </View>
                  <View style={styles.linkLine} />
                  <View style={styles.avatarWrap}>
                    <View style={styles.avatarCircle}>
                      <ThemedText style={styles.avatarLetter}>{peer?.[0]?.toUpperCase() || 'U'}</ThemedText>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold">@{peer}</ThemedText>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => removeConnection(item.id)}>
                  <ThemedText style={styles.buttonText}>Remove</ThemedText>
                </TouchableOpacity>
              </View>
            );
          }}
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  leftCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  circleIcon: {
    height: 28,
    width: 28,
    borderRadius: 999,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLine: {
    width: 28,
    height: 2,
    backgroundColor: '#e5e7eb',
  },
  avatarWrap: {
    height: 36,
    width: 36,
    borderRadius: 999,
    overflow: 'hidden',
  },
  avatarCircle: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  avatarLetter: {
    color: '#fff',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonText: { color: '#fff' },
});



