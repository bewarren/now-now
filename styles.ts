import { StatusBar, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  sendRequestRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    margin: 0,
    height: "20%",
  },
  sendButton: {
    fontSize: 24,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
    width: "40%",
    height: "7.5%",
  },
  friendWrapperCustom: {
    borderRadius: 8,
    padding: 6,

    width: "40%",
  },
  sendWrapperCustom: {
    borderRadius: 10,
    padding: 6,
    marginTop: 10,
    width: "45%",
  },
  listContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  friendItem: {
    elevation: 2,
    padding: 20,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requestItem: {
    elevation: 2,
    padding: 20,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  requestPerson: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  acceptReject: {
    margin: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  personSending: {
    fontWeight: "600",
    fontSize: 22,
  },
  personRequesting: {
    fontWeight: "400",
    fontSize: 18,
    marginLeft: 6,
    marginTop: 3,
  },
  description: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  wallet: {
    flex: 1,
    backgroundColor: "#fff",
  },
  balance: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingLeft: 20,
    backgroundColor: "#8dfc9e",
    justifyContent: "center",
    margin: 10,
    borderRadius: 10,
  },
  yourBalance: {
    fontSize: 20,
    marginBottom: 6,
  },
  balanceFont: {
    borderRadius: 5,
    fontSize: 32,
    marginBottom: 6,
    paddingLeft: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#aaaaaa",
    borderRadius: 10,
    padding: 10,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingLeft: 16,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  inputFocus: {
    height: 48,
    borderWidth: 1,
    borderColor: "#8dfc9e",
    borderRadius: 10,
    padding: 10,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 30,
    paddingLeft: 16,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#8dfc9e",
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
    color: "#8dfc9e",
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
