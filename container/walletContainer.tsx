import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import WalletScreen from "../Wallet/WalletScreen";
import SendScreen from "../Wallet/SendScreen";
import { Session } from "@supabase/supabase-js";
import RequestScreen from "../Wallet/RequestScreen";
import AwaitSending from "../Wallet/AwaitSending";

const WalletContainer = ({ session }: { session: Session }) => {
  const Stack = createNativeStackNavigator();

  const walletName = "Wallet Screen";
  const sendName = "Send Screen";
  const requestName = "Request Screen";
  const awaitSendingName = "Confirm Sending";

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
          title: "Home",
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
      <Stack.Screen
        name={awaitSendingName}
        options={{
          headerLeft: () => null,
          title: "Confirm Sending",
        }}
      >
        {(props) => (
          <AwaitSending key={session.user.id} navigation={props.navigation} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default WalletContainer;
