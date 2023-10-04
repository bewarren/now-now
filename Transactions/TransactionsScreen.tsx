import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";
import styles from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight, faMultiply } from "@fortawesome/free-solid-svg-icons";

type ItemProps = {
  description: string;
  from: string;
  to: string;
  amount: string;
  paid: boolean;
};

const Item = ({ description, from, to, amount, paid }: ItemProps) => {
  let text;
  let payButton = false;

  if (paid) {
    text = `${from} sent  R${amount} to ${to} for: `;
  } else if (!paid && to === "You") {
    text = `${to} requested R${amount} from ${from} for:`;
  } else if (!paid && from === "You") {
    payButton = true;
    text = `${to} requested R${amount} from ${from} for:`;
  } else {
    text = "";
  }

  return (
    <View style={styles.item}>
      <Text style={styles.personSending}>{text}</Text>
      <Text style={styles.description}>{description}</Text>
      {payButton && (
        <View style={styles.payCancelRow}>
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#8dfc9e" : "#61fa78",
              },
              styles.payWrapperCustom,
            ]}
          >
            {({ pressed }) => {
              return (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row-reverse",
                    justifyContent: "space-around",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMultiply}
                    size={22}
                    style={{ marginTop: 4.5 }}
                  />
                  <Text style={styles.sendButton}>Cancel</Text>
                </View>
              );
            }}
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#8dfc9e" : "#61fa78",
              },
              styles.payWrapperCustom,
            ]}
          >
            {({ pressed }) => {
              return (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row-reverse",
                    justifyContent: "space-around",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size={20}
                    style={{ marginTop: 5.5 }}
                  />
                  <Text style={styles.sendButton}>Pay</Text>
                </View>
              );
            }}
          </Pressable>
        </View>
      )}
    </View>
  );
};

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
          `id, description, from: from_id (id, full_name) , to: to_id (id, full_name), amount, paid`
        )
        .or(`from_id.eq.${session.user.id},and(to_id.eq.${session.user.id})`)
        .order("updated_at", { ascending: false })
        .limit(10);

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
          const from =
            item.from.id === session.user.id ? "You" : item.from.full_name;
          const to = item.to.id === session.user.id ? "You" : item.to.full_name;

          const amount = item.amount;
          const paid = item.paid;

          return (
            <Item
              description={item.description}
              from={from}
              to={to}
              amount={amount}
              paid={paid}
            />
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default TransactionsScreen;
