import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

const GroupForm = ({
  session,
  navigation,
  params,
}: {
  session: Session;
  navigation: any;
  params: any;
}) => {
  const [name, setName] = useState(null);

  const userId = session?.user?.id;

  const validate = () => {
    if (name === "" || name === null) {
      return false;
    } else {
      return true;
    }
  };

  const createGroup = async () => {
    // validate input
    if (validate()) {
      const { data, error } = await supabase
        .from("group")
        .insert({
          created_at: new Date(),
          name: name,
        })
        .select();

      if (data && data.length > 0) {
        return data[0]?.id;
      }

      if (error) {
        return -1;
      } else {
        // navigation.navigate("Group");
      }
    } else {
      console.log("false");
    }

    // add to database
    // navigate back to wallet
  };
  const getGroups = async (profile_id: any, group_id: any) => {
    const { data, error } = await supabase
      .from("group_link")
      .select()
      .eq("profile_id", profile_id)
      .eq("group_id", group_id);

    if (data && !error) {
      const group_array = await data.reduce((accumulator, currentValue) => {
        if (!accumulator.includes(currentValue.group_id)) {
          accumulator.push(currentValue);
        }
        return accumulator;
      }, []);
    }
  };

  return <div>Group Form</div>;
};

export default GroupForm;
