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
  id: number;
  from: string;
  to: string;
  amount: string;
  paid: boolean;
  pay: () => void;
  cancel: () => void;
};

const Item = ({
  description,
  id,
  from,
  to,
  amount,
  paid,
  pay,
  cancel,
}: ItemProps) => {
  let text;
  let payButton = false;

  if (paid) {
    text = `${from} sent R${amount} to ${to} `;
  } else if (!paid && to === "You") {
    text = `${to} requested R${amount} from ${from}`;
  } else if (!paid && from === "You") {
    payButton = true;
    text = `${to} requested R${amount}`;
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
            onPress={cancel}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
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
            onPress={pay}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
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

const TransactionsScreen = ({
  session,
  navigation,
  params,
}: {
  session: Session;
  navigation: any;
  params: any;
}) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any>([]);
  const [offSet, setOffSet] = useState<number>(10);

  useEffect(() => {
    if (session) {
      getTransactions(10);
    }
    const transactionsChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        (payload) => {
          getTransactions(10);
        }
      )
      .subscribe();
    return () => {
      transactionsChannel.unsubscribe();
    };
  }, [session]);

  const handleEnd = () => {
    if (transactions.length >= 10) {
      setOffSet((prevState: number) => prevState + 10);
      getTransactions(offSet + 10);
    }
  };

  const pay = async (id: number) => {
    const { error } = await supabase
      .from("transactions")
      .update({ paid: true, updated_at: new Date() })
      .eq("id", id);

    if (!error) {
      getTransactions(10);
      setOffSet(10);
    }
  };

  const cancel = async (id: number) => {
    const { error } = await supabase
      .from("transactions")
      .update({ rejected: true, updated_at: new Date() })
      .eq("id", id);

    if (!error) {
      getTransactions(10);
      setOffSet(10);
    }
  };

  async function getTransactions(offSet: number) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("transactions")
        .select(
          `id, description, from: from_id (id, full_name) , to: to_id (id, full_name), amount, paid`
        )
        .or(`from_id.eq.${session.user.id},and(to_id.eq.${session.user.id})`)
        .eq("rejected", false)
        .order("updated_at", { ascending: false })
        .limit(offSet);

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

  // if (loading) {
  //   return (
  //     <View style={[styles.container, styles.horizontal]}>
  //       <ActivityIndicator size="large" color="#00cc1f" />
  //     </View>
  //   );
  // }
  return (
    <SafeAreaView style={styles.listContainer}>
      <FlatList
        key={1}
        data={transactions}
        renderItem={({ item }) => {
          const from =
            item.from.id === session.user.id ? "You" : item.from.full_name;
          const to = item.to.id === session.user.id ? "You" : item.to.full_name;

          const amount = item.amount
            .toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })
            .replaceAll(",", " ");
          const paid = item.paid;

          return (
            <Item
              description={item.description}
              id={item.id}
              from={from}
              to={to}
              amount={amount}
              paid={paid}
              pay={() => {
                pay(item.id);
              }}
              cancel={() => {
                cancel(item.id);
              }}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        onEndReached={handleEnd}
      />
      {loading && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#00cc1f" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default TransactionsScreen;
