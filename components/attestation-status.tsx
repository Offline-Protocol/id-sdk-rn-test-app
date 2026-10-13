import { useEffect, useState, useSyncExternalStore } from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '@offline-protocol/id-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  checkAppAttestSupport,
  getAttestationStatus,
  getAttestationResult,
  getNativeBundleIdentifier,
  offlineAppId,
  subscribeAttestationStatus,
} from '@/lib/attestation';

export function AttestationStatus() {
  const { user } = useAuth();
  const [bundleId, setBundleId] = useState<string | null>(null);
  const [support, setSupport] = useState('Checking…');
  const status = useSyncExternalStore(subscribeAttestationStatus, getAttestationStatus, getAttestationStatus);
  const result = useSyncExternalStore(subscribeAttestationStatus, getAttestationResult, getAttestationResult);
  const label = result?.state === 'verified' ? 'Verified by auth-service'
    : result?.state === 'not_checked' ? 'Not checked'
    : result?.state === 'submitted' ? 'Proof submitted — verification unconfirmed'
    : result?.state === 'rejected' ? 'Failed — sign-in allowed without verified attestation'
    : result?.state === 'unavailable' ? 'Unavailable — verification not confirmed'
    : result?.state === 'key_registered' ? 'Key registered — sign-in proof pending'
    : result?.state === 'preparing' || result?.state === 'proof_generated' ? 'In progress'
    : 'Unknown — sign in again to check';

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
      {user && <ThemedText type="defaultSemiBold" accessibilityLiveRegion="polite">Attestation: {label}</ThemedText>}
      <ThemedText selectable>App ID: {offlineAppId}</ThemedText>
      <ThemedText selectable>Installed bundle ID: {bundleId ?? 'Native iOS build required'}</ThemedText>
      <ThemedText>Device: {support}</ThemedText>
      <ThemedText accessibilityLiveRegion="polite">{status}</ThemedText>
      {result?.state !== 'verified' && <ThemedText>Sign-in success alone does not prove attestation passed in report mode.</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8, padding: 16, borderWidth: 1, borderColor: '#888', borderRadius: 12 },
});
