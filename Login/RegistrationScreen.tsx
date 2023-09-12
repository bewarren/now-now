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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEnvelope,
  faICursor,
  faPen,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";

const RegistrationScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);

  const [fullName, setFullName] = useState("");
  const [fullNameFocus, setFullNameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [loading, setLoading] = useState(false);

  const loadingHandler = () => {
    setLoading(false);
  };

  const onRegisterPress = async () => {
    setLoading(true);

    if (formValidationRegister(email, password, confirmPassword)) {
      const signUpSuccess: boolean = await signUpWithEmail(
        email,
        password,
        fullName
      );
      loadingHandler();
      if (signUpSuccess) {
        navigation.navigate("Verify Email Screen");
      }
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
        <ActivityIndicator size="large" color="#00cc1f" />
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
        <View style={emailFocus ? styles.inputFocus : styles.input}>
          <FontAwesomeIcon
            icon={faEnvelope}
            color={emailFocus ? "#8dfc9e" : "#aaaaaa"}
          />
          <TextInput
            style={{ paddingLeft: 10, height: "100%", width: "100%" }}
            placeholderTextColor={emailFocus ? "#8dfc9e" : "#aaaaaa"}
            placeholder="Email"
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
        </View>
        <View style={fullNameFocus ? styles.inputFocus : styles.input}>
          <FontAwesomeIcon
            icon={faPen}
            color={fullNameFocus ? "#8dfc9e" : "#aaaaaa"}
          />
          <TextInput
            style={{ paddingLeft: 10, height: "100%", width: "100%" }}
            placeholderTextColor={fullNameFocus ? "#8dfc9e" : "#aaaaaa"}
            placeholder="Full Name"
            onChangeText={(text) => setFullName(text)}
            onFocus={() => {
              setFullNameFocus(true);
            }}
            onBlur={() => {
              setFullNameFocus(false);
            }}
            value={fullName}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <View style={passwordFocus ? styles.inputFocus : styles.input}>
          <FontAwesomeIcon
            icon={faUnlock}
            color={passwordFocus ? "#8dfc9e" : "#aaaaaa"}
          />
          <TextInput
            style={{ paddingLeft: 10, height: "100%", width: "100%" }}
            placeholderTextColor={passwordFocus ? "#8dfc9e" : "#aaaaaa"}
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
        </View>
        <View style={confirmPasswordFocus ? styles.inputFocus : styles.input}>
          <FontAwesomeIcon
            icon={faUnlock}
            color={confirmPasswordFocus ? "#8dfc9e" : "#aaaaaa"}
          />
          <TextInput
            style={{ paddingLeft: 10, height: "100%", width: "100%" }}
            placeholderTextColor={confirmPasswordFocus ? "#8dfc9e" : "#aaaaaa"}
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
        </View>

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
