import { useState } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import styles from "../styles";
import { formValidationRegister, signUpWithEmail } from "./loginFunctions";

const RegistrationScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [loading, setLoading] = useState(false);

  const loadingHandler = () => {
    setLoading(false);
  };

  const navigationHandler = () => {
    navigation.navigate("Email Verification", { email: email });
  };

  const onRegisterPress = () => {
    setLoading(true);

    if (formValidationRegister(email, password, confirmPassword)) {
      signUpWithEmail(email, password);
    } else {
      loadingHandler();
    }
  };

  const onFooterLinkPress = () => {
    navigation.navigate("Login Screen");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#FFA5D6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          alignContent: "center",
          justifyContent: "center",
          marginTop: "50%",
        }}
        keyboardShouldPersistTaps="always"
      >
        <TextInput
          style={emailFocus ? styles.inputFocus : styles.input}
          placeholder="Email"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          onFocus={() => {
            setEmailFocus(true);
          }}
          onBlur={() => {
            setEmailFocus(false);
          }}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={passwordFocus ? styles.inputFocus : styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          onFocus={() => {
            setPasswordFocus(true);
          }}
          onBlur={() => {
            setPasswordFocus(false);
          }}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={confirmPasswordFocus ? styles.inputFocus : styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          onFocus={() => {
            setConfirmPasswordFocus(true);
          }}
          onBlur={() => {
            setConfirmPasswordFocus(false);
          }}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}
        >
          <Text style={styles.buttonTitle}>Sign up</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RegistrationScreen;
