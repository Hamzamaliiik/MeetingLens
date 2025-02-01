import { useEffect, useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center auth-gradient">
      {user ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Sign out
          </button>
        </div>
      ) : (
        <AuthForm />
      )}
      <Toaster />
    </div>
  );
}

export default App