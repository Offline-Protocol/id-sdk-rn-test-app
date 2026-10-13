import { useEffect, useState, useSyncExternalStore } from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  checkAppAttestSupport,
  getAttestationStatus,
  getNativeBundleIdentifier,
  offlineAppId,
  subscribeAttestationStatus,
} from '@/lib/attestation';

export function AttestationStatus() {
  const [bundleId, setBundleId] = useState<string | null>(null);
  const [support, setSupport] = useState('Checking…');
  const status = useSyncExternalStore(subscribeAttestationStatus, getAttestationStatus, getAttestationStatus);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getNativeBundleIdentifier(), checkAppAttestSupport()])
      .then(([bundle, supported]) => {
        if (cancelled) return;
        setBundleId(bundle);
        setSupport(supported ? 'Supported' : 'Unavailable');
      })
      .catch((error) => {
        if (!cancelled) setSupport(`Check failed: ${String(error)}`);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <ThemedView style={styles.card}>
      <ThemedText type="subtitle">iOS App Attest</ThemedText>
      <ThemedText selectable>App ID: {offlineAppId}</ThemedText>
      <ThemedText selectable>Installed bundle ID: {bundleId ?? 'Native iOS build required'}</ThemedText>
      <ThemedText>Device: {support}</ThemedText>
      <ThemedText accessibilityLiveRegion="polite">{status}</ThemedText>
      <ThemedText>Sign-in success alone does not prove attestation passed in report mode. Confirm the server reports a verified attestation.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8, padding: 16, borderWidth: 1, borderColor: '#888', borderRadius: 12 },
});
