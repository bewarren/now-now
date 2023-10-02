import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import WalletScreen from "../Wallet/WalletScreen";
import SendScreen from "../Wallet/SendScreen";
import { Session } from "@supabase/supabase-js";

const WalletContainer = ({ session }: { session: Session }) => {
  const Stack = createNativeStackNavigator();

  const walletName = "Wallet Screen";
  const sendRequestName = "Send Request Screen";

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
        name={sendRequestName}
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
    </Stack.Navigator>
  );
};

export default WalletContainer;
