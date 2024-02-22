import {
  Alert,
  TouchableOpacity,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "../styles";
import { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Input } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { FileObject } from "@supabase/storage-js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowAltCircleRight,
  faArrowRight,
  faArrowRightLong,
  faBackward,
  faChevronRight,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import FloatingTextInput from "./FloatingTextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type OpenURLButtonProps = {
  url: string;
  children: string;
};

const ProfileScreen = ({ session }: { session: Session }) => {
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState<any>("");

  const [snapScanLink, setSnapScanLink] = useState<any>("");

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
        .select(`full_name, snapscan_link`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullName(data.full_name);
        setSnapScanLink(data.snapscan_link);
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
    loadImages(session.user.id);
  }, [session.user]);

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
        loadImages(session.user.id);
      } else {
        Alert.alert("error");
        setLoadingImage(false);
      }
    }
  };

  const handleEdit = () => {
    setEdit((prevState) => !prevState);
  };
  const handleCancel = () => {
    handleEdit();
    getProfile();
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
  };

  const handleSnapScanLinkChange = (text: string) => {
    setSnapScanLink(text);
  };

  const update = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, snapscan_link: snapScanLink })
      .eq("id", session.user.id);

    if (!error) {
      setEdit(false);
      getProfile();
    }
  };

  const getInitals = (fullName: any) => {
    return fullName.match(/(\b\S)?/g).join("");
  };

  const [displayPaymentDetails, setDisplayPaymentDetails] =
    useState<boolean>(false);

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00cc1f" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.profile}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          alignContent: "center",
          justifyContent: "center",
          marginTop: "0%",
          marginBottom: "0%",
        }}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Pressable
            onPress={edit && !loadingImage ? onSelectedImage : () => {}}
          >
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
                {!edit && (
                  <Text
                    style={{
                      textAlign: "center",
                      margin: "auto",
                      justifyContent: "center",
                      fontSize: 50,
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {getInitals(fullName)}
                  </Text>
                )}
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
                    style={{
                      margin: "45%",
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
            )}
          </Pressable>
        </View>
        <FloatingTextInput
          label="Full Name"
          border={0}
          value={fullName || ""}
          editable={edit}
          handleChange={handleFullNameChange}
        />
        <FloatingTextInput
          label="Email"
          border={0}
          value={session.user.email || ""}
          editable={false}
          handleChange={() => {}}
        />
        {/* <FloatingTextInput
          label="Snapscan Link"
          border={0}
          value={snapScanLink || ""}
          editable={edit}
          handleChange={handleSnapScanLinkChange}
        /> */}

        <TouchableOpacity
          onPress={() => {}}
          style={{
            marginHorizontal: 30,
            marginVertical: 2,
            alignContent: "center",
            alignItems: "center",
            padding: 15,
            borderColor: "#00db22",
            borderWidth: 1,
            borderRadius: 12,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 18, color: "#00db22", fontWeight: "600" }}>
            Payment details
          </Text>
          <FontAwesomeIcon icon={faChevronRight} size={14} color={"#00db22"} />
        </TouchableOpacity>

        {edit && (
          <View style={styles.profileButtons}>
            <TouchableOpacity style={styles.rowButton} onPress={handleCancel}>
              <Text style={styles.buttonTitle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowButton} onPress={update}>
              <Text style={styles.buttonTitle}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
        {!edit && (
          <View style={styles.profileButtons}>
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
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
