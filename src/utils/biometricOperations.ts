import { supabase } from "@/integrations/supabase/client";

export const getAuthenticatedUserId = async () => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) throw sessionError;
  if (!session?.user?.id) {
    throw new Error("No authenticated user found");
  }
  
  return session.user.id;
};

export const verifyBiometricCredentials = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("biometric_credentials")
    .eq("id", userId)
    .single();
  
  if (error) throw error;
  if (!data?.biometric_credentials?.email || !data?.biometric_credentials?.credentialId) {
    throw new Error("Biometric credentials not found. Please set up biometric authentication first.");
  }
  
  return data.biometric_credentials;
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
  credential: PublicKeyCredential,
  challenge: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-biometric`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        credential,
        challenge,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Biometric verification failed');
  }

  return response.json();
};