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
import PaymentMethods from "./Login/PaymentMethods";
// import PaymentMethods from "./Login/PaymentMethods";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [firstLogin, setFirstLogin] = useState<boolean>(true);

  const firstLoginHandler = () => {
    setFirstLogin(false);
  };

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (session?.user) {
        let { data, error, status } = await supabase
          .from("profiles")
          .select(`first_login`)
          .eq("id", session?.user.id)
          .single();
        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setFirstLogin(data.first_login);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

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

  // need to manage when people have signed up but haven't verified email

  return (
    <>
      {session && session.user && !firstLogin && (
        <MainContainer session={session} />
      )}
      {session && session.user && firstLogin && (
        <PaymentMethods
          session={session}
          firstLoginHandler={firstLoginHandler}
        />
      )}
      {!session && <LoginContainer />}
    </>
  );
}
