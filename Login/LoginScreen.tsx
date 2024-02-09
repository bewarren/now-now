import { useState } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../styles";
import { formValidationLogin, signInWithEmail } from "./loginFunctions";
import FloatingTextInput from "../components/FloatingTextInput";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const loadingHandler = () => {
    setLoading(false);
  };

  const onFooterLinkPress = () => {
    navigation.navigate("Registration Screen");
  };

  //   const onResetPasswordPress = () => {
  //     navigation.navigate("Reset Password Screen");
  //   };

  //   const navigationHandler = () => {
  //     navigation.navigate("Main");
  //   };

  const onLoginPress = () => {
    setLoading(true);
    if (formValidationLogin(email, password)) {
      setLoading(true);
      signInWithEmail(email, password).then(() => {
        setLoading(false);
      });
    } else {
      loadingHandler();
    }
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

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : "height"}
      style={styles.container}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          alignContent: "center",
          justifyContent: "center",
          marginTop: "60%",
        }}
        keyboardShouldPersistTaps="always"
      >
        <FloatingTextInput
          label="Email"
          value={email}
          handleChange={handleEmailChange}
        />
        <FloatingTextInput
          label="Password"
          value={password}
          secureTextEntry={true}
          handleChange={handlePasswordChange}
        />

        <TouchableOpacity style={styles.button} onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>

        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>

        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 50,
            marginHorizontal: 30,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
          <View>
            <Text style={{ width: 50, textAlign: "center" }}>or</Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
        </View> */}
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
