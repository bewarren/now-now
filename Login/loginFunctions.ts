import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) Alert.alert(error.message);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    Alert.alert(error.message);
    return false;
  } else {
    return true;
  }
}

export const formValidationLogin = (email: string, password: string) => {
  if (email.trim() === "") {
    Alert.alert("Please enter your email");
    return false;
  }
  if (!email.includes("@")) {
    Alert.alert("Please enter a valid email address");
    return false;
  }
  if (password.length < 6) {
    Alert.alert("Your password must be longer than 6 characters");
    return false;
  }

  return true;
};

export const formValidationRegister = (
  email: string,
  password: string,
  confirmPassword: string
) => {
  if (email.trim() === "") {
    Alert.alert("Please enter your email");
    return false;
  }
  if (password.length < 6) {
    Alert.alert("Your password must be longer than 6 characters");
    return false;
  }
  if (password !== confirmPassword) {
    Alert.alert("Your confirmed password doesn't match your entered password");
    return false;
  }

  return true;
};
