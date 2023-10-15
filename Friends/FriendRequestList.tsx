import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import styles from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { err } from "react-native-svg/lib/typescript/xml";

type ItemProps = {
  name: string | null;
  acceptFriend: () => void;
  rejectFriend: () => void;
};

const Item = ({ name, acceptFriend, rejectFriend }: ItemProps) => {
  return (
    <View style={styles.requestItem}>
      <Text style={styles.requestPerson}>
        <Text style={styles.personSending}>{`${name} \n`}</Text>
        <Text style={styles.personRequesting}>requested to be your friend</Text>
      </Text>
      <View style={styles.acceptReject}>
        <Pressable
          onPress={acceptFriend}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
            },
            styles.friendWrapperCustom,
          ]}
        >
          {({ pressed }) => {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  size={22}
                  style={{ marginTop: 4.5 }}
                />
                <Text style={styles.sendButton}>Accept</Text>
              </View>
            );
          }}
        </Pressable>
        <Pressable
          onPress={rejectFriend}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#61fa78" : "#8dfc9e",
            },
            styles.friendWrapperCustom,
          ]}
        >
          {({ pressed }) => {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size={22}
                  style={{ marginTop: 4.5 }}
                />
                <Text style={styles.sendButton}>Reject</Text>
              </View>
            );
          }}
        </Pressable>
      </View>
    </View>
  );
};

const FriendRequestList = ({
  session,
  navigation,
}: {
  session: Session;
  navigation: any;
}) => {
  const [friendRequests, setFriendRequests] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [offSet, setOffSet] = useState<number>(20);

  const getFriendRequests = async (offSet: number) => {
    setLoading(true);
    const friendRequestsData: any[] = [];
    const { data, error, status } = await supabase
      .from("friendships")
      .select(`*, requester: requester_id (full_name)`)
      .eq("addressee_id", session.user.id)
      .eq("accepted", false)
      .eq("rejected", false)
      .limit(offSet);

    if (data && !error) {
      setFriendRequests(
        data?.map((d) => {
          return { ...d, requester_name: d.requester.full_name };
        })
      );

      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const acceptFriend = async (id: number) => {
    const { data, error, status } = await supabase
      .from("friendships")
      .update({ accepted: true })
      .eq("id", id)
      .select();

    if (!error) {
      getFriendRequests(20);
      setOffSet(20);
      navigation.navigate("Friends");
    }
  };

  const rejectFriend = async (id: number) => {
    const { error } = await supabase
      .from("friendships")
      .update({ rejected: true })
      .eq("id", id);

    if (!error) {
      getFriendRequests(20);
      setOffSet(20);
      navigation.navigate("Friends");
    }
  };

  useEffect(() => {
    if (session) {
      getFriendRequests(20);

      const friendshipsChannel = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "friendships" },
          (payload) => {
            getFriendRequests(20);
          }
        )
        .subscribe();
      return () => {
        friendshipsChannel.unsubscribe();
      };
    }
  }, [session]);

  const handleEnd = () => {
    if (friendRequests.length >= 20) {
      setOffSet((prevState: number) => prevState + 10);
      getFriendRequests(offSet + 10);
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
    <SafeAreaView style={styles.listContainer}>
      {friendRequests.length > 0 && (
        <FlatList
          key={1}
          data={friendRequests}
          renderItem={({ item }) => {
            return (
              <Item
                name={item?.requester_name}
                acceptFriend={() => {
                  acceptFriend(item?.id);
                }}
                rejectFriend={() => {
                  rejectFriend(item?.id);
                }}
              />
            );
          }}
          keyExtractor={(item) => item.id}
          onEndReached={handleEnd}
        />
      )}
    </SafeAreaView>
  );
};

export default FriendRequestList;
