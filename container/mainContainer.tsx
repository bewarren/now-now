import * as React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faWallet,
  faArrowRightArrowLeft,
  faUser,
  faMoneyCheck,
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import { NavigationContainer } from "@react-navigation/native";
import Test from "../components/Test";
import { Session } from "@supabase/supabase-js";
import Account from "../components/Account";

// import ProfileContainer from "./profileContainer";

const walletName = "Wallet";
const paymentsName = "Payments";
const profileName = "Profile";
const transactionsName = "Transactions";
const peopleName = "Friends";

const Tab = createBottomTabNavigator();

const MainContainer = ({ session }: { session: Session }) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={walletName}
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#2ad14e",
        }}
      >
        <Tab.Screen
          name={walletName}
          options={{
            headerShown: true,
            tabBarIcon: ({ size, color }) => (
              <FontAwesomeIcon icon={faWallet} size={size} color={color} />
            ),
          }}
        >
          {(props) => <Account key={session.user.id} session={session} />}
        </Tab.Screen>
        <Tab.Screen
          name={paymentsName}
          component={Test}
          options={{
            headerShown: true,
            tabBarIcon: ({ size, color }) => (
              <FontAwesomeIcon
                icon={faArrowRightArrowLeft}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;
