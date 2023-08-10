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
import { formValidationLogin, signInWithEmail } from "./loginFunctions";

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);

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

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          alignContent: "center",
          justifyContent: "center",
          marginTop: "60%",
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
        {/* <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Forgot password?{" "}
            <Text onPress={onResetPasswordPress} style={styles.footerLink}>
              Reset
            </Text>
          </Text>
        </View> */}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;
