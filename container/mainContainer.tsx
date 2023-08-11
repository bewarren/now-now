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

// import ProfileContainer from "./profileContainer";

const walletName = "Wallet";
const paymentsName = "Payments";
const profileName = "Profile";
const transactionsName = "Transactions";
const peopleName = "Friends";

const Tab = createBottomTabNavigator();

const MainContainer = ({ session }: { session: Session }) => {
  const tabOffsetValue = React.useRef(new Animated.Value(0)).current;

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
            headerShown: true,
            tabBarIcon: ({ size, color }) => (
              <FontAwesomeIcon icon={faWallet} size={size} color={color} />
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            },
          })}
        >
          {(props) => <WalletScreen />}
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
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 1.1,
                useNativeDriver: true,
              }).start();
            },
          })}
        >
          {(props) => (
            <TransactionsScreen key={session.user.id} session={session} />
          )}
        </Tab.Screen>
        <Tab.Screen
          name={peopleName}
          component={FriendsScreen}
          options={{
            headerShown: true,
            tabBarIcon: ({ size, color }) => (
              <FontAwesomeIcon
                icon={faPeopleArrows}
                size={size}
                color={color}
              />
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 2.3,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name={profileName}
          options={{
            headerShown: true,
            tabBarIcon: ({ size, color }) => (
              <FontAwesomeIcon icon={faUser} size={size} color={color} />
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3.5,
                useNativeDriver: true,
              }).start();
            },
          })}
        >
          {(props) => <Account key={session.user.id} session={session} />}
        </Tab.Screen>
      </Tab.Navigator>
      <Animated.View
        style={{
          width: getWidth() - 10,
          height: 2,
          backgroundColor: "#00cc1f",
          position: "absolute",
          bottom: 89,
          left: 15,
          transform: [{ translateX: tabOffsetValue }],
        }}
      ></Animated.View>
    </NavigationContainer>
  );
};

const getWidth = () => {
  let width = Dimensions.get("window").width;

  width = width - 60;

  return width / 4;
};

export default MainContainer;
