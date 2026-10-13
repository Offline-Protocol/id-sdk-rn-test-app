# Offline ID React Native test app

Expo test app using the local `../id-sdk-react-native` SDK. Its iOS build uses
Apple App Attest to prove that sign-in comes from the installed bundle registered
for the app in the Offline developer portal.

## Build and run on an iPhone

```sh
cd ../id-sdk-react-native
npm install
npm run build
cd ../id-sdk-rn-test-app
npm install
npx expo run:ios --device
```

Use a **physical iPhone**, a signing team, and an Apple provisioning profile with
the App Attest capability enabled for `com.aditipolkam.offline-id`. Expo Go runs
under its own bundle and does not include this native module. A simulator cannot
produce a real App Attest proof. Rebuild the native app after changing the module
or the entitlements; restarting Metro alone is insufficient.

`app.json` configures the bundle identifier and the **development** App Attest
entitlement. For a production distribution build, use the production entitlement
and its corresponding provisioning profile.

The app ID defaults to `proj_firstprojectuq6o0` from `expo.extra.appId`. If testing
another portal app, set `EXPO_PUBLIC_OFFLINE_APP_ID` before starting/building Expo:

```sh
EXPO_PUBLIC_OFFLINE_APP_ID=app_your_portal_app npx expo run:ios --device
```

The app ID is a public identifier, not an API secret. The portal app identified by
this value must register `com.aditipolkam.offline-id` in its **Native apps** tab.

## Verify the registered bundle

1. In the developer portal, add the iOS bundle ID above to the selected app.
2. In that app's Native apps tab, pair the bundle ID with its Apple App ID
   prefix (usually your signing Team ID), choose **Report failures**, and enable
   **Allow development builds**. No backend environment changes are needed.
3. Open the Home tab. The App Attest card displays the **actual installed** bundle
   ID from `Bundle.main`, the app ID, device support, and the latest native step.
4. Tap **Login** and complete email OTP sign-in. Log out first if testing another
   sign-in; restoring an existing session does not attest.
5. Confirm the requests reach auth-service and the server's
   `auth_native_attestation_total{platform="ios",outcome="verified",reason="none"}`
   counter increases. Initial registration also records `outcome="registered"`.
   These counters are aggregate, so isolate the test traffic when comparing them.

The SDK obtains challenges at `/auth/users/attestation/challenge`, generates a
key once per install, and posts Apple's attestation object to
`/auth/users/attestation/ios/register`. It then generates a fresh assertion and
attaches `{ platform: "ios", challenge, keyId, assertion }` to
`/auth/verify-code`. The bridge decodes the SDK's base64 32-byte hash without
hashing it again, and returns Apple's bytes as base64. The SDK stores the
registered key ID and handles fresh challenges and unknown-key retries.

The bundle ID is cryptographically bound into Apple's attestation/assertion.
It is **not** a caller-supplied bundle ID field in the iOS request. Auth-service
matches it against the registered bundle IDs and allowed Apple team IDs.

**A successful login in report mode does not prove the attestation passed.**
The SDK can fall back to sending no proof when the native provider or registration
fails, and the server can accept that sign-in. When signed in, Home shows the
server's result: **Verified**, **Failed**, **Unavailable**, or **Not checked**.
Older servers without a result show **Proof submitted — verification unconfirmed**;
restored sessions without a result show **Unknown**. Use Home's **Logout** button
and sign in again to check a fresh proof. Metro also prints
native progress/errors with `[App Attest]` and SDK warnings with
`Attestation unavailable`, without logging proof bytes, key IDs, OTPs or tokens.

For a stricter positive/negative test, choose **Require valid attestation** in
that application's Native apps tab. The app must have no browser origins; use a
separate portal application for browser sign-in. Confirm the registered build
signs in, then replace the portal signing identity with a different bundle or
App ID prefix. Wait up to 60 seconds for the registry cache to refresh and retry:
the same build should be refused. Restore the portal identity after the test.
Keep **Allow development builds** enabled while testing this Xcode build.

Android and web can still run the test app, but this bridge implements **iOS only**;
they do not send native attestation. Android verification needs a separate Play
Integrity provider and Play Console setup.

See the [SDK attestation API](../id-sdk-react-native/README.md#app-attestation-ios-app-attest-android-play-integrity)
and [auth-service setup](../auth-service/docs/NATIVE_ATTESTATION.md) for the protocol
and server settings, and [Apple's App Attest guide](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity)
for the native service requirements. The bridge is an [Expo local module](https://docs.expo.dev/modules/autolinking/)
discovered automatically under `modules/`.
