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
import FloatingTextInput from "../components/FloatingTextInput";

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

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

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
        <FloatingTextInput
          label="Email"
          value={email}
          handleChange={handleEmailChange}
        />
        <FloatingTextInput
          label="Full Name"
          value={fullName}
          handleChange={handleFullNameChange}
        />
        <FloatingTextInput
          label="Password"
          value={password}
          secureTextEntry={true}
          handleChange={handlePasswordChange}
        />

        <FloatingTextInput
          label="Confirm Password"
          value={confirmPassword}
          secureTextEntry={true}
          handleChange={handleConfirmPasswordChange}
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
