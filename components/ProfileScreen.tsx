import {
  Alert,
  TouchableOpacity,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import FloatingTextInput from "./FloatingTextInput";

const ProfileScreen = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [fullNameFocus, setFullNameFocus] = useState<boolean>(false);
  const [image, setImage] = useState<string>();
  const [edit, setEdit] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);

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
    setLoadingImage(true);
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(`${session.user.id}.png`);
    if (data) {
      const fr = new FileReader();
      fr.readAsDataURL(data!);
      fr.onload = () => {
        setImage(fr.result as string);
        setLoadingImage(false);
      };
    }

    if (error) {
      Alert.alert(error.message);
      setLoadingImage(false);
    } else {
      setLoadingImage(false);
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
      setLoadingImage(true);
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

      if (!error) {
        loadImages();
      } else {
        Alert.alert("error");
        setLoadingImage(false);
      }
    }
  };

  const handleEdit = () => {
    setEdit((prevState) => !prevState);
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
  };

  const update = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", session.user.id);

    if (!error) {
      setEdit(false);
      getProfile();
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
        <Pressable onPress={edit && !loadingImage ? onSelectedImage : () => {}}>
          {image ? (
            <View>
              <Image
                style={{ width: 150, height: 150, borderRadius: 120 }}
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
              {edit && !loadingImage && (
                <FontAwesomeIcon
                  icon={faEdit}
                  size={20}
                  style={{
                    margin: "40%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 23,
                    height: 23,
                    color: "white",
                  }}
                />
              )}
            </View>
          ) : (
            <View
              style={{
                width: 150,
                height: 150,
                borderRadius: 120,
                backgroundColor: "#00cc1f",
                margin: "auto",
                justifyContent: "center",
              }}
            >
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
              {edit && !loadingImage && (
                <FontAwesomeIcon
                  icon={faEdit}
                  size={22}
                  style={{ marginTop: 4.5 }}
                />
              )}
            </View>
          )}
        </Pressable>
      </View>
      <FloatingTextInput
        label="Full Name"
        value={fullName || ""}
        editable={edit}
        handleChange={handleFullNameChange}
        onFocus={() => {
          setFullNameFocus(true);
        }}
        onBlur={() => {
          setFullNameFocus(false);
        }}
      />
      <FloatingTextInput
        label="Email"
        value={session.user.email || ""}
        editable={false}
        handleChange={handleFullNameChange}
        onFocus={() => {
          setFullNameFocus(true);
        }}
        onBlur={() => {
          setFullNameFocus(false);
        }}
      />
      {/* <Input
        label="Full Name"
        value={fullName || ""}
        editable={edit}
        onChange={edit ? handleFullNameChange : () => {}}
      /> */}
      {/* <Input label="Email" value={session.user.email || ""} editable={false} /> */}
      {edit && (
        <View style={styles.payCancelRow}>
          <TouchableOpacity style={styles.rowButton} onPress={handleEdit}>
            <Text style={styles.buttonTitle}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rowButton} onPress={update}>
            <Text style={styles.buttonTitle}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
      {!edit && (
        <View style={styles.payCancelRow}>
          <TouchableOpacity style={styles.rowButton} onPress={handleEdit}>
            <Text style={styles.buttonTitle}>Edit Information</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rowButton}
            onPress={() => supabase.auth.signOut()}
          >
            <Text style={styles.buttonTitle}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* <TouchableOpacity style={styles.button} onPress={onSelectedImage}>
        <Text style={styles.buttonTitle}>Upload image</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ProfileScreen;
