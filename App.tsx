import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Account from "./components/Account";
import { ActivityIndicator, Alert, View } from "react-native";
import { Session } from "@supabase/supabase-js";
import MainContainer from "./container/mainContainer";
import LoginContainer from "./container/loginContainer";
import styles from "./styles";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      })
      .catch((err) => {
        Alert.alert("error");
        setLoading(false);
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00cc1f" />
      </View>
    );
  }

  return (
    <>
      {session && session.user ? (
        <MainContainer session={session} />
      ) : (
        // <Account key={session.user.id} session={session} />
        // <Auth />
        <LoginContainer />
      )}
    </>
  );
}
