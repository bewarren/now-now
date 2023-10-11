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
import { Animated, Dimensions, View } from "react-native";
import WalletScreen from "../Wallet/WalletScreen";
import TransactionsScreen from "../Transactions/TransactionsScreen";
import FriendsScreen from "../Friends/FriendsScreen";
import FriendsContainer from "./friendsContainer";
import WalletContainer from "./walletContainer";
import ProfileScreen from "../components/ProfileScreen";

// import ProfileContainer from "./profileContainer";

const walletName = "Wallet";
const paymentsName = "Payments";
const profileName = "Profile";
const transactionsName = "Transactions";
const peopleName = "Friends Container";

const Tab = createBottomTabNavigator();

const MainContainer = ({ session }: { session: Session }) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={walletName}
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#00cc1f",

          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: "white",
            position: "absolute",
            height: 90,
          },
        }}
      >
        <Tab.Screen
          name={walletName}
          options={{
            headerShown: false,
            tabBarIcon: ({ size, color }) => (
              <FontAwesomeIcon icon={faWallet} size={size} color={color} />
            ),
          }}
        >
          {(props) => (
            <WalletContainer key={session.user.id} session={session} />
          )}
        </Tab.Screen>
        <Tab.Screen
          name={paymentsName}
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
        >
          {(props) => (
            <TransactionsScreen
              key={session.user.id}
              session={session}
              navigation={props.navigation}
              params={props.route.params}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name={peopleName}
          options={{
            headerShown: false,
            title: "Friends",
            tabBarIcon: ({ size, color }) => (
              <FontAwesomeIcon
                icon={faPeopleArrows}
                size={size}
                color={color}
              />
            ),
          }}
        >
          {(props) => (
            <FriendsContainer key={session.user.id} session={session} />
          )}
        </Tab.Screen>
        <Tab.Screen
          name={profileName}
          options={{
            headerShown: true,
            tabBarIcon: ({ size, color }) => (
              <FontAwesomeIcon icon={faUser} size={size} color={color} />
            ),
          }}
        >
          {(props) => <ProfileScreen key={session.user.id} session={session} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainContainer;
