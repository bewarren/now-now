import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { supabase } from "../lib/supabase";

const FriendRequestList = ({ session }: { session: Session }) => {
  const [friendRequests, setFriendRequests] = useState<any>([]);
  const getFriendRequests = async () => {
    const { data, error } = await supabase
      .from("friendships")
      .select()
      .or(
        `addressee_id.eq.${session.user.id},and(accepted.eq.false),and(rejected.eq.false)`
      );

    if (!error) {
      setFriendRequests(data);
    }
  };
  useEffect(() => {
    if (session) {
      getFriendRequests();
    }
  }, [session]);

  console.log(friendRequests);
  return <View></View>;
};

export default FriendRequestList;
