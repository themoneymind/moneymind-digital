import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthError = () => {
    setSession(null);
    setUser(null);
    localStorage.removeItem("isFirstTimeUser");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("rememberedEmail");
    navigate("/signin");
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        handleAuthError();
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        handleAuthError();
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        if (!session) {
          console.error("No session after token refresh");
          handleAuthError();
          return;
        }
        console.log('Token refreshed successfully');
      }

      if (event === 'SIGNED_IN') {
        if (!session) {
          console.error("No session after sign in");
          handleAuthError();
          return;
        }
        console.log('Signed in successfully');
      }

      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      // First clear local state and redirect
      handleAuthError();
      
      // Then try to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      // Only show error toast if it's not a session_not_found error
      if (error && !error.message.includes('session_not_found')) {
        console.error("Error signing out:", error);
        toast({
          title: "Note",
          description: "You have been signed out locally, but there was an issue with the server.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast({
        title: "Note",
        description: "You have been signed out locally, but there was an unexpected error.",
        variant: "default",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};