import { StatusBar, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "500",
    margin: 5,
    marginLeft: 20,
    marginTop: 20,
    width: 80,
  },
  sendRequestRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    margin: 0,
    height: 50,
    width: "100%",
  },
  awaitRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  payCancelRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    borderColor: "black",
    marginHorizontal: 16,
    borderBottomWidth: 1,
    marginTop: 10,
    margin: 0,
    paddingBottom: 20,
    height: "100%",
  },
  profileButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginTop: 10,
    margin: 0,
    paddingBottom: 20,
    height: "100%",
  },
  filterRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginHorizontal: 5,
    paddingBottom: 10,
  },
  sendRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    margin: 0,
  },
  sendButton: {
    fontSize: 24,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
  },
  filterButton: {
    fontSize: 20,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
  },
  payCancelButton: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    color: "white",
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
    width: "40%",
  },
  payWrapperCustom: {
    borderRadius: 8,
    padding: 6,
    width: "33%",
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
  walletSendWrapper: {
    borderRadius: 10,
    padding: 6,
    marginTop: 30,
    marginLeft: 20,
    width: "90%",
    height: "6%",
  },
  listContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
    marginBottom: 90,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "black",
    borderBottomWidth: 1,
    padding: 20,
    marginVertical: 1,
    marginHorizontal: 12,
  },
  itemPay: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    marginVertical: 1,
    marginHorizontal: 12,
  },
  itemColumn: {
    marginLeft: 20,
    margin: "auto",
    marginTop: 10,
    flexShrink: 1,
  },
  friendColumn: {
    marginLeft: 20,
    margin: "auto",
    marginTop: 13,
  },
  friendItem: {
    padding: 20,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requestItem: {
    // backgroundColor: "white",
    padding: 20,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginVertical: 8,
    marginHorizontal: 16,
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
    fontSize: 16,
  },
  friendName: {
    fontWeight: "500",
    fontSize: 24,
  },
  personRequesting: {
    fontWeight: "400",
    fontSize: 18,
    marginLeft: 6,
    paddingTop: 20,
  },
  description: {
    fontSize: 16,
    marginTop: 2,
    flexWrap: "wrap",
  },
  date: {
    fontSize: 12,
    fontWeight: "300",
    marginTop: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  hoverLoad: {
    position: "relative",
  },
  wallet: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%",
  },
  profile: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: "5%",
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
    height: 55,
    borderWidth: 1,
    borderColor: "#aaaaaa",
    borderRadius: 10,
    padding: 10,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingLeft: 16,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  inputFocus: {
    height: 55,
    borderWidth: 1,
    borderColor: "#8dfc9e",
    borderRadius: 10,
    padding: 10,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingLeft: 16,
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    marginLeft: 32,
    marginBottom: 30,
    fontSize: 24,
    fontWeight: "600",
    color: "#00db22",
  },
  summaryHeader: {
    margin: "auto",
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 36,
    fontWeight: "700",
    color: "#00db22",
  },

  summaryInfo: {
    marginLeft: 32,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "600",
    color: "#00db22",
  },
  infoText: {
    marginLeft: 32,
    padding: 10,
    fontSize: 16,
    fontWeight: "400",
  },
  welcome: {
    margin: "auto",
    alignContent: "center",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: "600",
    paddingHorizontal: 20,
  },
  welcomeText: {
    margin: "auto",
    alignContent: "center",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: "600",
    padding: 20,
  },
  button: {
    backgroundColor: "#00db22",
    marginHorizontal: 35,
    marginTop: 20,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  skipButton: {
    borderColor: "#00db22",
    borderWidth: 2,
    marginHorizontal: 35,
    marginTop: 20,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  awaitButton: {
    backgroundColor: "#00db22",
    marginHorizontal: 35,
    marginTop: 20,
    width: "30%",
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  rowButton: {
    backgroundColor: "#00db22",
    marginHorizontal: 35,
    marginTop: 20,
    height: 50,
    width: "45%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTitleSkip: {
    color: "#00db22",
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
    color: "#00db22",
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
