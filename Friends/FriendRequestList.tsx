import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View, Text, Pressable } from "react-native";
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

const FriendRequestList = ({ session }: { session: Session }) => {
  const [friendRequests, setFriendRequests] = useState<any>([]);
  const getFriendRequests = async () => {
    const { data, error, status } = await supabase
      .from("friendships")
      .select()

      .eq("addressee_id", session.user.id)
      .eq("accepted", false)
      .eq("rejected", false);

    if (!error) {
      setFriendRequests(data);
    }
  };

  const acceptFriend = async (id: number) => {
    const { data, error, status } = await supabase
      .from("friendships")
      .update({ accepted: true })
      .eq("id", id)
      .select();

    if (!error) {
      getFriendRequests();
    }
  };

  const rejectFriend = async (id: number) => {
    const { error } = await supabase
      .from("friendships")
      .update({ rejected: true })
      .eq("id", id);

    if (!error) {
      getFriendRequests();
    }
  };

  useEffect(() => {
    if (session) {
      getFriendRequests();
    }
  }, [session]);

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
        />
      )}
    </SafeAreaView>
  );
};

export default FriendRequestList;
