import DeviceCheck
import ExpoModulesCore

public class OfflineAppAttestModule: Module {
  public func definition() -> ModuleDefinition {
    Name("OfflineAppAttest")

    AsyncFunction("getBundleIdentifier") { () -> String in
      return Bundle.main.bundleIdentifier ?? ""
    }

    AsyncFunction("isSupported") { () -> Bool in
      return DCAppAttestService.shared.isSupported
    }

    AsyncFunction("generateKey") { (promise: Promise) in
      DCAppAttestService.shared.generateKey { keyId, error in
        if let error = error {
          promise.reject(error)
        } else if let keyId = keyId {
          promise.resolve(keyId)
        } else {
          promise.reject("ERR_APP_ATTEST_KEY", "App Attest returned no key ID")
        }
      }
    }

    AsyncFunction("attestKey") { (keyId: String, clientDataHash: String, promise: Promise) in
      guard let hash = Data(base64Encoded: clientDataHash), hash.count == 32 else {
        promise.reject("ERR_APP_ATTEST_HASH", "Expected a base64-encoded 32-byte SHA-256 hash")
        return
      }
      DCAppAttestService.shared.attestKey(keyId, clientDataHash: hash) { data, error in
        Self.resolve(data, error: error, promise: promise)
      }
    }

    AsyncFunction("generateAssertion") { (keyId: String, clientDataHash: String, promise: Promise) in
      guard let hash = Data(base64Encoded: clientDataHash), hash.count == 32 else {
        promise.reject("ERR_APP_ATTEST_HASH", "Expected a base64-encoded 32-byte SHA-256 hash")
        return
      }
      DCAppAttestService.shared.generateAssertion(keyId, clientDataHash: hash) { data, error in
        Self.resolve(data, error: error, promise: promise)
      }
    }
  }

  private static func resolve(_ data: Data?, error: Error?, promise: Promise) {
    if let error = error {
      promise.reject(error)
    } else if let data = data {
      promise.resolve(data.base64EncodedString())
    } else {
      promise.reject("ERR_APP_ATTEST_EMPTY", "App Attest returned no data")
    }
  }
}
