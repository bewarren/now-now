import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#aaaaaa",
    padding: 10,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 43,
    paddingLeft: 16,
    fontSize: 14,
  },
  inputFocus: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#0746F5",
    padding: 10,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 43,
    paddingLeft: 16,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#0746F5",
    marginHorizontal: 35,
    marginTop: 20,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#2e2e2d",
  },
  footerLink: {
    color: "#0746F5",
    fontWeight: "bold",
    fontSize: 16,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default styles;
