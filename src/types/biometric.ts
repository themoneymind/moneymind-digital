import { Json } from "@/integrations/supabase/types";

export interface BiometricCredentials {
  id: string;
  type: string;
  email: string;
  password?: string;
  credentialId: string;
  rawId: number[];
}

export interface BiometricAuthResponse {
  credential: Credential;
  challenge: string;
  email: string;
}

export interface BiometricEnrollResponse {
  id: string;
  type: string;
  rawId: Uint8Array;
}

export interface BiometricState {
  biometricEnabled: boolean;
  isBiometricSupported: boolean;
}