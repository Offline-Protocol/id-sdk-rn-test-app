import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@offline-protocol/id-react-native";

export default function HomeScreen() {
  const { user, sendCode, verifyCode } = useAuth();
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [phase, setPhase] = React.useState<"request" | "verify">("request");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onRequest = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const ok = await sendCode(email.trim());
      if (ok) setPhase("verify");
      else setError("Failed to send code");
    } catch {
      setError("Failed to send code");
    } finally {
      setSubmitting(false);
    }
  };

  const onVerify = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await verifyCode(email.trim(), code.trim());
      if (!res) setError("Invalid code");
    } catch {
      setError("Invalid code");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome {user?.username || "Friend"}!</ThemedText>
        <HelloWave />
      </ThemedView>

      {!user && (
        <ThemedView style={styles.loginCard}>
          <ThemedText type="subtitle">Sign in</ThemedText>
          {phase === "request" ? (
            <View style={{ gap: 10 }}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
              <TouchableOpacity style={styles.cta} disabled={!email || submitting} onPress={onRequest}>
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.ctaText}>Send Code</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              <ThemedText>We sent a code to {email}</ThemedText>
              <TextInput
                placeholder="Enter code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={styles.input}
              />
              <TouchableOpacity style={styles.cta} disabled={!code || submitting} onPress={onVerify}>
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.ctaText}>Verify</ThemedText>
                )}
              </TouchableOpacity>
            </View>
          )}
          {!!error && <ThemedText style={{ color: "#ef4444" }}>{error}</ThemedText>}
        </ThemedView>
      )}
 
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  loginCard: {
    gap: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  cta: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '600',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
