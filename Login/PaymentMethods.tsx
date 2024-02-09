import { useEffect, useState } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "../styles";
import { formValidationLogin, signInWithEmail } from "./loginFunctions";
import FloatingTextInput from "../components/FloatingTextInput";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const PaymentMethods = ({ session }: { session: Session }) => {
  const [step, setStep] = useState<string>("Bank");

  const STEPS = ["Welcome", "Bank", "SnapScan", "Summary"];

  // Bank info

  const [bank, setBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [snapscanLink, setSnapScanLink] = useState("");

  const [loading, setLoading] = useState(false);

  async function updateProfile() {
    try {
      setLoading(true);
      if (session?.user) {
        let { data, error, status } = await supabase
          .from("profiles")
          .update({
            bank: bank,
            accountName: accountName,
            accountNumber: accountNumber,

            firstLogin: false,
          })
          .eq("id", session?.user.id)
          .single();
        if (error && status !== 406) {
          throw error;
        }

        if (data) {
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

  const loadingHandler = () => {
    setLoading(false);
  };

  const handleBankChange = (text: string) => {
    setBank(text);
  };

  const handleAccountNameChange = (text: string) => {
    setAccountName(text);
  };

  const handleAccountNumberChange = (text: string) => {
    setAccountNumber(text);
  };

  const [selected, setSelected] = useState<string[]>([]);

  const handleNext = () => {
    setStep((prevState) => {
      if (prevState === "Select") {
        return "Bank";
      } else if (prevState === "Select") {
        return "SnapScan";
      } else if (prevState === "Bank") {
        return "SnapScan";
      } else {
        return "Summary";
      }
    });
  };

  const handleBack = () => {
    setStep((prevState) => {
      if (prevState === "Summary") {
        return "SnapScan";
      } else {
        return "Bank";
      }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00cc1f" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "height" : "height"}
      style={styles.container}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{
          alignContent: "center",
          justifyContent: "center",
          marginTop: "50%",
        }}
        keyboardShouldPersistTaps="always"
      >
        {step === "Bank" && (
          <View>
            <Text style={styles.info}>Bank Information</Text>

            <FloatingTextInput
              label="Bank"
              value={bank}
              handleChange={handleBankChange}
            />

            <FloatingTextInput
              label="Account Name"
              value={accountName}
              handleChange={handleAccountNameChange}
            />
            <FloatingTextInput
              label="Account Number"
              value={accountNumber}
              handleChange={handleAccountNumberChange}
            />
          </View>
        )}
        {step === "SnapScan" && (
          <View>
            <Image
              style={{
                marginLeft: 10,
                marginBottom: 20,
                width: 200,
                height: 50,
              }}
              source={require("./../assets/SnapScan.png")}
            />

            <FloatingTextInput
              label="SnapScan Link"
              value={snapscanLink}
              handleChange={() => {}}
            />
          </View>
        )}
        <View>
          {(step === "SnapScan" || step === "Summary") && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleBack()}
            >
              <Text style={styles.buttonTitle}>Back</Text>
            </TouchableOpacity>
          )}
          {(step === "Select" || step === "Bank" || step === "SnapScan") && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleNext()}
            >
              <Text style={styles.buttonTitle}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaymentMethods;
