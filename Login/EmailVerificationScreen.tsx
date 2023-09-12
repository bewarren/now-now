import { Text, TouchableOpacity, View } from "react-native";
import styles from "../styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const EmailVerificationScreen = ({ navigation }: { navigation: any }) => {
  const onFooterLinkPress = () => {
    navigation.navigate("Login Screen");
  };
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          alignContent: "center",
          justifyContent: "center",
          marginTop: "80%",
        }}
        keyboardShouldPersistTaps="always"
      >
        <Text style={{ fontSize: 20, textAlign: "center" }}>
          Verify email and then login
        </Text>
        <TouchableOpacity style={styles.button} onPress={onFooterLinkPress}>
          <Text style={styles.buttonTitle}>Login</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EmailVerificationScreen;
