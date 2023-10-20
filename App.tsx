import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./components/Auth";
import Account from "./components/Account";
import { Alert, View } from "react-native";
import { Session } from "@supabase/supabase-js";
import MainContainer from "./container/mainContainer";
import LoginContainer from "./container/loginContainer";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((err) => {
        Alert.alert("error");
      });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

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
