import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";
import styles from "../styles";

type ItemProps = {
  description: string;
  from: string;
  to: string;
  amount: string;
};

const Item = ({ description, from, to, amount }: ItemProps) => (
  <View style={styles.item}>
    <Text
      style={styles.personSending}
    >{`${from} sent ${to} R${amount} for: `}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const TransactionsScreen = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any>([]);

  useEffect(() => {
    if (session) getTransactions();
  }, [session]);

  async function getTransactions() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("transactions")
        .select(
          `id, description, from: from_id (id, full_name) , to: to_id (id, full_name), amount`
        )
        .or(`from_id.eq.${session.user.id},and(to_id.eq.${session.user.id})`)
        .limit(10);

      console.log(error);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setTransactions(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00cc1f" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.listContainer}>
      <FlatList
        key={1}
        data={transactions}
        renderItem={({ item }) => {
          console.log(item);
          const from =
            item.from.id === session.user.id ? "You" : item.from.full_name;
          const to = item.to.id === session.user.id ? "You" : item.to.full_name;
          const amount = item.amount;

          return (
            <Item
              description={item.description}
              from={from}
              to={to}
              amount={amount}
            />
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default TransactionsScreen;
