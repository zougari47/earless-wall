import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import nacl from 'tweetnacl';

const SERVICE = 'com.earlesswall.privatekey';

export function useKey() {
  const [keyPair, setKeyPair] = useState<{ publicKey: Uint8Array; secretKey: Uint8Array } | null>(
    null
  );

  const saveSecretKey = async (secretKey: Uint8Array) => {
    if (Platform.OS === 'web') {
      localStorage.setItem('secretKey', JSON.stringify(Array.from(secretKey)));
    } else {
      await Keychain.setGenericPassword('user', Array.from(secretKey).join(','), {
        service: SERVICE,
      });
    }
  };

  const loadSecretKey = async (): Promise<Uint8Array | null> => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('secretKey');
      return saved ? new Uint8Array(JSON.parse(saved)) : null;
    } else {
      const creds = await Keychain.getGenericPassword({ service: SERVICE });
      return creds ? new Uint8Array(creds.password.split(',').map(Number)) : null;
    }
  };

  useEffect(() => {
    (async () => {
      let secretKey = await loadSecretKey();
      if (!secretKey) {
        const pair = nacl.box.keyPair();
        await saveSecretKey(pair.secretKey);
        setKeyPair(pair);
      } else {
        // Reconstruct public key from private key
        const publicKey = nacl.box.keyPair.fromSecretKey(secretKey).publicKey;
        setKeyPair({ publicKey, secretKey });
      }
    })();
  }, []);

  return keyPair;
}
