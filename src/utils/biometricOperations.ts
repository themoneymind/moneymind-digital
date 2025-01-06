import { supabase } from "@/integrations/supabase/client";
import { getBiometricCredentials } from "./biometricUtils";
import { Session } from "@supabase/supabase-js";

export const getAuthenticatedUserId = async () => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) throw sessionError;
  
  const userId = sessionData.session?.user?.id;
  if (!userId) {
    throw new Error("No authenticated user found");
  }
  
  return userId;
};

export const verifyBiometricCredentials = async (userId: string) => {
  const biometricCredentials = await getBiometricCredentials(userId);
  
  if (!biometricCredentials?.email) {
    throw new Error("Biometric credentials not found. Please set up biometric authentication first.");
  }
  
  return biometricCredentials;
};

export const getAuthChallenge = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-auth-challenge`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get authentication challenge');
  }

  const { challenge } = await response.json();
  return challenge;
};

export const verifyBiometricAssertion = async (
  credential: any,
  challenge: string,
  email: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-biometric`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential, challenge, email }),
    }
  );

  if (!response.ok) {
    throw new Error('Biometric verification failed');
  }

  return response.json();
};