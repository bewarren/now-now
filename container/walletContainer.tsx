import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import WalletScreen from "../Wallet/WalletScreen";
import SendScreen from "../Wallet/SendScreen";
import { Session } from "@supabase/supabase-js";
import RequestScreen from "../Wallet/RequestScreen";

const WalletContainer = ({ session }: { session: Session }) => {
  const Stack = createNativeStackNavigator();

  const walletName = "Wallet Screen";
  const sendName = "Send Screen";
  const requestName = "Request Screen";

  return (
    <Stack.Navigator
      initialRouteName={walletName}
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name={walletName}
        options={{
          headerLeft: () => null,
          title: "Wallet",
        }}
      >
        {(props) => (
          <WalletScreen
            key={session.user.id}
            // session={session}
            navigation={props.navigation}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={sendName}
        options={{
          headerLeft: () => null,
          title: "Send",
        }}
      >
        {(props) => (
          <SendScreen
            key={session.user.id}
            session={session}
            navigation={props.navigation}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={requestName}
        options={{
          headerLeft: () => null,
          title: "Request",
        }}
      >
        {(props) => (
          <RequestScreen
            key={session.user.id}
            session={session}
            navigation={props.navigation}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default WalletContainer;
