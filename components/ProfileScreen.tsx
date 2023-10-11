import {
  Alert,
  TouchableOpacity,
  View,
  Text,
  Image,
  Pressable,
} from "react-native";
import styles from "../styles";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { FileObject } from "@supabase/storage-js";

const ProfileScreen = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState<string>();
  // allow editing only on click

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullName(data.full_name);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!session.user) return;

    // Load user images
    loadImages();
  }, [session.user]);

  const loadImages = async () => {
    const { data } = await supabase.storage
      .from("avatars")
      .download(`${session.user.id}.png`);
    if (data) {
      const fr = new FileReader();
      fr.readAsDataURL(data!);
      fr.onload = () => {
        setImage(fr.result as string);
      };
      // fr.onerror = () => {

      // }
    }
  };

  const onSelectedImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, {
        encoding: "base64",
      });
      const filePath = `${session.user.id}.png`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, decode(base64), {
          contentType: "image/png",
          upsert: true,
        });

      console.log(error);
      loadImages();
    }
  };

  return (
    <View style={styles.profile}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 30,
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <Pressable onPress={onSelectedImage}>
          {image ? (
            <Image
              style={{ width: 150, height: 150, borderRadius: 120 }}
              source={{ uri: image }}
            />
          ) : (
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 120,
                backgroundColor: "#1A1A1A",
              }}
            />
          )}
        </Pressable>
      </View>
      <Input label="Full Name" value={fullName || ""} editable={false} />
      <Input label="Email" value={session.user.email || ""} editable={false} />
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonTitle}>Update Info</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={styles.buttonTitle}>Logout</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={onSelectedImage}>
        <Text style={styles.buttonTitle}>Upload image</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ProfileScreen;
