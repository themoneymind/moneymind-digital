import { supabase } from "@/integrations/supabase/client";
import { BiometricCredentials, BiometricEnrollResponse } from "@/types/biometric";
import { Json } from "@/integrations/supabase/types";

export const getBiometricCredentials = async (userId: string): Promise<BiometricCredentials | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("biometric_credentials")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data?.biometric_credentials as unknown as BiometricCredentials;
};

export const updateBiometricCredentials = async (
  userId: string, 
  credentials: Json
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({
      biometric_credentials: credentials,
      preferred_auth_method: "biometric"
    })
    .eq("id", userId);

  if (error) throw error;
};

export const disableBiometricAuth = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({
      biometric_credentials: null,
      preferred_auth_method: "password"
    })
    .eq("id", userId);

  if (error) throw error;
};

export const createBiometricNotification = async (
  userId: string,
  enabled: boolean
): Promise<void> => {
  await supabase.from("notifications").insert({
    user_id: userId,
    message: `Biometric authentication has been ${enabled ? 'enabled' : 'disabled'} for your account`,
    type: "security_update"
  });
};

export const isBiometricSupported = (): boolean => {
  return window.PublicKeyCredential !== undefined;
};