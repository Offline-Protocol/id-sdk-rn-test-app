import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth, useConnections } from '@offline-protocol/id-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { connections } = useConnections();

  if (!user) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        {/* Header */}
        
        <View style={[styles.card, { alignItems: 'center' }]}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              <ThemedText style={styles.avatarText}>
                {(user.username || 'ID').slice(0, 2).toUpperCase()}
              </ThemedText>
            </View>
          </View>
          <ThemedText type="title">@{user.username}</ThemedText>
          <ThemedText style={{ opacity: 0.7 }}>{user.email}</ThemedText>
          <View style={styles.badgesRow}>
            <View style={[styles.badge, user.verified ? styles.badgeSuccess : styles.badgeMuted]}>
              <ThemedText style={styles.badgeText}>{user.verified ? 'Verified' : 'Unverified'}</ThemedText>
            </View>
            {user.walletAddress && (
              <View style={[styles.badge, styles.badgeMuted]}>
                <ThemedText style={styles.badgeText}>Wallet linked</ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.rowSplit}>
          <View style={[styles.card, styles.statCard]}>
            <ThemedText type="subtitle" style={{ marginBottom: 4 }}>Connections</ThemedText>
            <ThemedText type="title">{connections.length}</ThemedText>
          </View>
          <View style={[styles.card, styles.statCard]}>
            <ThemedText type="subtitle" style={{ marginBottom: 4 }}>Points</ThemedText>
            <ThemedText type="title">{user.totalPoints}</ThemedText>
          </View>
        </View>

        {/* About Card */}
        <View style={styles.card}>
          <ThemedText type="subtitle">About</ThemedText>
          <ThemedText style={{ marginTop: 6 }}>
            {user.username
              ? `Hey, I'm @${user.username}. I’m using Offline ID to build trusted connections.`
              : 'Welcome to Offline ID!'}
          </ThemedText>
        </View>

        {/* Account Details */}
        <View style={styles.card}>
          <ThemedText type="subtitle">Account</ThemedText>
          <View style={styles.kvRow}>
            <ThemedText style={styles.kvKey}>Email</ThemedText>
            <ThemedText style={styles.kvVal}>{user.email}</ThemedText>
          </View>
          <View style={styles.kvRow}>
            <ThemedText style={styles.kvKey}>User ID</ThemedText>
            <ThemedText style={styles.kvVal}>{user.id}</ThemedText>
          </View>
          <View style={styles.kvRow}>
            <ThemedText style={styles.kvKey}>Referral</ThemedText>
            <ThemedText style={styles.kvVal}>{user.referralCode}</ThemedText>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={() => {}}>
            <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Edit Profile</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={logout}>
            <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Logout</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  card: {
    gap: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  avatarWrap: {
    height: 84,
    width: 84,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 8,
  },
  avatarCircle: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
  },
  badgeSuccess: {
    backgroundColor: '#10b981',
  },
  badgeMuted: {
    backgroundColor: '#6b7280',
  },
  rowSplit: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  logout: {
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    alignItems: 'center',
    padding: 12,
  },
  kvRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kvKey: {
    opacity: 0.7,
  },
  kvVal: {
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: '#0a7ea4',
  },
  secondaryBtn: {
    backgroundColor: '#111827',
  },
});


