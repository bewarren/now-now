import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../Login/LoginScreen";
import RegistrationScreen from "../Login/RegistrationScreen";

const LoginContainer = () => {
  const Stack = createNativeStackNavigator();

  const loginName = "Login Screen";
  const registrationName = "Registration Screen";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoginContainer;
