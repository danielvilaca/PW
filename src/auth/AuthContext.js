import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { fetchPerfil, createPerfil } from '../api/perfis';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user,   setUser]   = useState(undefined); // undefined = ainda a carregar
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);


  useEffect(() => {
    if (user === undefined) return;
    if (user === null)      return setPerfil(null); // logged out

    (async () => {
      try {
        const existente = await fetchPerfil(user.id);
        if (existente) {
          setPerfil(existente);
          return;
        }

        await createPerfil({
          user_id : user.id,
          role    : 'inquilino', // default
          nome    : '',
          foto_url: null,
        });

        const novo = await fetchPerfil(user.id);
        setPerfil(novo);
      } catch (err) {
        console.error('PERFIL-ERROR →', JSON.stringify(err, null, 2));
      }
    })();
  }, [user]);


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
        isLoading: user === undefined,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
