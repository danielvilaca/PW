// src/auth/AuthContext.js

import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { fetchPerfil, createPerfil } from '../api/perfis';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // user: supabase Auth user object, or null if not logged in, or undefined while loading
  const [user, setUser] = useState(undefined);
  // perfil: row from "perfis" table corresponding to the logged‐in user (or null if none)
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();

  // 1. On mount, fetch current session and set up listener for auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2. Whenever "user" changes, load (or create) their perfil record
  useEffect(() => {
    if (user === undefined) {
      // still loading initial session
      return;
    }

    if (user === null) {
      // logged out → clear perfil
      setPerfil(null);
      return;
    }

    // If we have a real user, attempt to fetch their perfil
    (async () => {
      try {
        const existing = await fetchPerfil(user.id);
        if (existing) {
          setPerfil(existing);
        } else {
          // If no perfil exists, create a default one as "inquilino"
          const newProfile = await createPerfil({
            user_id: user.id,
            role: 'inquilino',
            nome: '',
            foto_url: null,
            validated: true, // newly created inquilino is validated by default
          });
          setPerfil(newProfile);
        }
      } catch (err) {
        console.error('AUTH-PERFIL-ERROR →', err);
        setPerfil(null);
      }
    })();
  }, [user]);

  // 3. Login method
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('LOGIN-ERROR →', error);
      return false;
    }
    setUser(data.user);
    navigate('/condominios');
    return true;
  };

  // 4. Logout method
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        perfil,
        isLoading: user === undefined,      // true while initial session is being loaded
        isAuthenticated: !!user,             // boolean
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
