import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../Login/LoginScreen";
import RegistrationScreen from "../Login/RegistrationScreen";
import EmailVerificationScreen from "../Login/EmailVerificationScreen";

const LoginContainer = () => {
  const Stack = createNativeStackNavigator();

  const loginName = "Login Screen";
  const registrationName = "Registration Screen";
  const verifyEmailName = "Verify Email Screen";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={loginName}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={loginName}
          component={LoginScreen}
          options={{
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name={registrationName}
          component={RegistrationScreen}
          options={{
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name={verifyEmailName}
          component={EmailVerificationScreen}
          options={{
            headerLeft: () => null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoginContainer;
