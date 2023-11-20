import { TouchableOpacity, View, Text } from "react-native";
import styles from "../styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AwaitSending = ({ navigation }: { navigation: any }) => {
  const onAmountSent = () => {
    navigation.navigate("Wallet Screen");
  };
  const onCancel = () => {
    navigation.navigate("Wallet Screen");
  };

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
        <Text style={{ fontSize: 20, textAlign: "center" }}>
          Did you complete the transaction on SnapScan?
        </Text>
        <View style={styles.awaitRow}>
          <TouchableOpacity style={styles.awaitButton} onPress={onCancel}>
            <Text style={styles.buttonTitle}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.awaitButton} onPress={onAmountSent}>
            <Text style={styles.buttonTitle}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AwaitSending;
