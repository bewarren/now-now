import { Text, View } from "react-native";
import styles from "../styles";
import Balance from "./Balance";
import SendRequest from "./SendRequest";

const WalletScreen = () => {
  return (
    <View style={styles.wallet}>
      <Balance />
      <SendRequest />
    </View>
  );
};

export default WalletScreen;
