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
  Image,
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
  friendId: string;
  amount: string;
  paid: boolean;
  date: string;
  pay: () => void;
  cancel: () => void;
};

const Item = ({
  description,
  id,
  from,
  to,
  friendId,
  amount,
  paid,
  date,
  pay,
  cancel,
}: ItemProps) => {
  let text;
  let payButton = false;

  if (paid) {
    text = `${from} paid ${to} R${amount}`;
  } else if (!paid && to === "You") {
    text = `${to} requested R${amount} from ${from}`;
  } else if (!paid && from === "You") {
    payButton = true;
    text = `${to} requested R${amount}`;
  } else {
    text = "";
  }

  const [image, setImage] = useState<string>();
  const [loadingImage, setLoadingImage] = useState<boolean>(false);

  const getInitals = (fullName: any) => {
    return fullName.match(/(\b\S)?/g).join("");
  };

  useEffect(() => {
    if (!friendId) return;

    // Load user images
    loadImages(friendId);
  }, [friendId]);

  const loadImages = async (id: any) => {
    setLoadingImage(true);
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(`${id}.png`);
    if (data) {
      const fr = new FileReader();
      fr.readAsDataURL(data!);
      fr.onload = () => {
        setImage(fr.result as string);
        setLoadingImage(false);
      };
    }

    if (error) {
      setLoadingImage(false);
    } else {
      setLoadingImage(false);
    }
  };

  return (
    <View>
      <View style={payButton ? styles.itemPay : styles.item}>
        {image ? (
          <View>
            <Image
              style={{ width: 60, height: 60, borderRadius: 120 }}
              source={{ uri: image }}
            />
            {loadingImage && (
              <ActivityIndicator
                size="large"
                color="white"
                style={{
                  margin: "40%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 23,
                  height: 23,
                }}
              />
            )}
          </View>
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 120,
              backgroundColor: "#00cc1f",
              margin: "auto",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                margin: "auto",
                justifyContent: "center",
                fontSize: 30,
                color: "white",
                fontWeight: "600",
              }}
            >
              {from === "You" ? getInitals(to) : getInitals(from)}
            </Text>

            {loadingImage && (
              <ActivityIndicator
                size="large"
                color="white"
                style={{
                  margin: "40%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 23,
                  height: 23,
                }}
              />
            )}
          </View>
        )}

        <View style={styles.itemColumn}>
          <Text style={styles.personSending}>{text}</Text>

          <Text style={styles.description}>{description}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
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
}: {
  session: Session;
  navigation: any;
  params: any;
}) => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any>([]);
  const [offSet, setOffSet] = useState<number>(10);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    if (session) {
      getTransactions(10, selectedFilter);
    }
    const transactionsChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        (payload) => {
          getTransactions(10, selectedFilter);
        }
      )
      .subscribe();
    return () => {
      transactionsChannel.unsubscribe();
    };
  }, [session, selectedFilter]);

  const handleEnd = () => {
    if (transactions.length >= 10) {
      setOffSet((prevState: number) => prevState + 10);
      getTransactions(offSet + 10, selectedFilter);
    }
  };

  const pay = async (id: number) => {
    const { error } = await supabase
      .from("transactions")
      .update({ paid: true, updated_at: new Date() })
      .eq("id", id);

    if (!error) {
      getTransactions(10, selectedFilter);
      setOffSet(10);
    }
  };

  const cancel = async (id: number) => {
    const { error } = await supabase
      .from("transactions")
      .update({ rejected: true, updated_at: new Date() })
      .eq("id", id);

    if (!error) {
      getTransactions(10, selectedFilter);
      setOffSet(10);
    }
  };

  async function getTransactions(offSet: number, filter: string) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      if (filter === "all") {
        let { data, error, status } = await supabase
          .from("transactions")
          .select(
            `id, description, from: from_id (id, full_name) , to: to_id (id, full_name), amount, paid, updated_at`
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
      } else if (filter === "outgoing") {
        let { data, error, status } = await supabase
          .from("transactions")
          .select(
            `id, description, from: from_id (id, full_name) , to: to_id (id, full_name), amount, paid, updated_at`
          )
          .eq("from_id", session.user.id)
          .eq("rejected", false)
          .order("updated_at", { ascending: false })
          .limit(offSet);
        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setTransactions(data);
        }
      } else {
        let { data, error, status } = await supabase
          .from("transactions")
          .select(
            `id, description, from: from_id (id, full_name) , to: to_id (id, full_name), amount, paid, updated_at`
          )
          .eq("to_id", session.user.id)
          .eq("rejected", false)
          .order("updated_at", { ascending: false })
          .limit(offSet);
        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setTransactions(data);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const pressAll = () => {
    setSelectedFilter("all");
  };

  const pressOutgoing = () => {
    setSelectedFilter("outgoing");
  };

  const pressIncoming = () => {
    setSelectedFilter("incoming");
  };

  return (
    <SafeAreaView style={styles.listContainer}>
      <View style={{ height: "10%" }}>
        <View style={styles.filterRow}>
          <Pressable
            onPress={pressAll}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? "#61fa78"
                  : selectedFilter === "all"
                  ? "#8dfc9e"
                  : "#fff",
              },
              styles.payWrapperCustom,
            ]}
          >
            {({ pressed }) => {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-start",
                  }}
                >
                  <Text style={styles.filterButton}>All</Text>
                </View>
              );
            }}
          </Pressable>
          <Pressable
            onPress={pressOutgoing}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? "#61fa78"
                  : selectedFilter === "outgoing"
                  ? "#8dfc9e"
                  : "#fff",
              },
              styles.payWrapperCustom,
            ]}
          >
            {({ pressed }) => {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-start",
                  }}
                >
                  <Text style={styles.filterButton}>Outgoing</Text>
                </View>
              );
            }}
          </Pressable>
          <Pressable
            onPress={pressIncoming}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? "#61fa78"
                  : selectedFilter === "incoming"
                  ? "#8dfc9e"
                  : "#fff",
              },
              styles.payWrapperCustom,
            ]}
          >
            {({ pressed }) => {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-start",
                  }}
                >
                  <Text style={styles.filterButton}>Incoming</Text>
                </View>
              );
            }}
          </Pressable>
        </View>
      </View>
      {(!loading || transactions.length >= 10) && (
        <FlatList
          key={1}
          data={transactions}
          renderItem={({ item }) => {
            const from =
              item.from.id === session.user.id ? "You" : item.from.full_name;
            const to =
              item.to.id === session.user.id ? "You" : item.to.full_name;

            const friendId =
              item.from.id === session.user.id ? item.to.id : item.from.id;

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
                friendId={friendId}
                amount={amount}
                paid={paid}
                date={new Date(item.updated_at).toDateString()}
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
      )}
      {loading && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#00cc1f" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default TransactionsScreen;
