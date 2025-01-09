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
    console.log("Handling auth error - clearing session and user");
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
      console.log("Initial session retrieved:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out - clearing session");
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

      if (event === 'USER_UPDATED') {
        console.log("User updated event received");
        // Check if this is an email confirmation
        const currentUser = session?.user;
        const previousEmailConfirmed = user?.email_confirmed_at;
        const newEmailConfirmed = currentUser?.email_confirmed_at;
        
        console.log("Previous email confirmed:", previousEmailConfirmed);
        console.log("New email confirmed:", newEmailConfirmed);
        
        const isEmailConfirmation = newEmailConfirmed && 
                                  (!previousEmailConfirmed || 
                                   new Date(newEmailConfirmed).getTime() > new Date(previousEmailConfirmed).getTime());
        
        if (isEmailConfirmation) {
          console.log("Email confirmation detected - navigating to success page");
          navigate('/email-confirmation-success');
          return;
        }
      }

      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, user?.email_confirmed_at]);

  const signOut = async () => {
    try {
      console.log("Attempting to sign out");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Sign out successful");
      handleAuthError();
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};