import { Session } from "@supabase/supabase-js";
import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Alert } from "react-native";

const GroupScreen = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [groupLinks, setGroupLinks] = useState<any>([]);

  async function getGroups(offSet: number, filter: string) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("group_links")
        .select("*")
        .eq("profile_id", session?.user?.id);

      if (error && status !== 406) {
        throw error;
      }

      console.log(data);

      if (data) {
        setGroupLinks(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return <div>Group Screen</div>;
};

export default GroupScreen;
