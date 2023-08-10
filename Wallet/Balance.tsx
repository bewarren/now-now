import { View, Text } from "react-native";
import styles from "../styles";

const Balance = () => {
  return (
    <View style={styles.balance}>
      <Text style={styles.yourBalance}>Your Balance</Text>
      <Text style={styles.balanceFont}>R 10</Text>
    </View>
  );
};

export default Balance;
