import type { AttestationProviders, AttestationStatus } from '@offline-protocol/id-react-native';
import Constants from 'expo-constants';
import { requireOptionalNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

interface NativeAppAttest {
  getBundleIdentifier(): Promise<string>;
  isSupported(): Promise<boolean>;
  generateKey(): Promise<string>;
  attestKey(keyId: string, clientDataHash: string): Promise<string>;
  generateAssertion(keyId: string, clientDataHash: string): Promise<string>;
}

export const offlineAppId: string =
  process.env.EXPO_PUBLIC_OFFLINE_APP_ID ?? Constants.expoConfig?.extra?.appId ?? '';

const native = Platform.OS === 'ios'
  ? requireOptionalNativeModule<NativeAppAttest>('OfflineAppAttest')
  : null;

let status = 'No attestation attempted yet. Verify an email code to send one.';
let result: AttestationStatus | null = null;
const listeners = new Set<() => void>();
export const getAttestationStatus = () => status;
export const getAttestationResult = () => result;
export function resetAttestationStatus() {
  result = null;
  report('No attestation attempted yet. Verify an email code to send one.');
}
export function subscribeAttestationStatus(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function report(message: string) {
  status = message;
  console.info('[App Attest]', message);
  listeners.forEach((listener) => listener());
}

export async function checkAppAttestSupport(): Promise<boolean> {
  if (!native) {
    report(Platform.OS === 'ios'
      ? 'App Attest bridge missing. Build and install the native iOS app; Expo Go cannot attest this bundle.'
      : 'This test app provides iOS App Attest only. Use a physical iPhone to verify the bundle ID.');
    return false;
  }
  const supported = await native.isSupported();
  if (!supported) report('App Attest is unsupported on this device. Use a physical iPhone.');
  return supported;
}

export async function getNativeBundleIdentifier(): Promise<string | null> {
  return native ? native.getBundleIdentifier() : null;
}

async function nativeCall<T>(step: string, call: () => Promise<T>, success: string): Promise<T> {
  report(step);
  try {
    const result = await call();
    report(success);
    return result;
  } catch (error) {
    report(`${step} failed: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

// Keep this object stable: changing providers resets the SDK's attestor.
// Hashes arrive already SHA-256 hashed and base64 encoded by the SDK.
export const attestationProviders: AttestationProviders = {
  onStatus: (next) => {
    result = next;
    report(next.message);
  },
  ios: {
    isSupported: checkAppAttestSupport,
    generateKey: () => nativeCall('Generating key', () => native!.generateKey(), 'Key generated'),
    attestKey: (keyId, hash) => nativeCall(
      'Attesting key', () => native!.attestKey(keyId, hash),
      'Apple attestation generated; SDK will register the key with auth-service.',
    ),
    generateAssertion: (keyId, hash) => nativeCall(
      'Generating assertion', () => native!.generateAssertion(keyId, hash),
      'Assertion generated; SDK will attach it to sign-in. Check auth-service for the verification result.',
    ),
  },
};
