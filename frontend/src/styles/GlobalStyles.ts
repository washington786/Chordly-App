import { StyleSheet } from "react-native";
import { GreenMain, white } from "./Colors";

const GlobalStyles = StyleSheet.create({
  container: {
    // backgroundColor: GreenMain[500],
    flex: 1,
  },
  containerSpaceHorizontal: {
    paddingHorizontal: 10,
  },
  containerSpaceVertical: {
    paddingVertical: 10,
  },
  textColor: {
    color: white[50],
  },
  logo: {
    width: 110,
    height: 110,
  },
  textInput: {
    marginVertical: 8,
    color: white[50],
  },
  outline: {
    backgroundColor: "rgba(0,0,0,0.01)",
    borderColor: white[50],
  },
  content: {
    color: white[100],
  },
  button: {
    borderRadius: 2,
    padding: 8,
    backgroundColor: white[100],
    marginVertical: 5,
  },
  buttonOutline: {
    borderRadius: 2,
    padding: 8,
    backgroundColor: "transparent",
    marginVertical: 5,
    borderColor: white[50],
    borderWidth: 1,
  },
  btnContent: {
    fontSize: 16,
    fontWeight: "400",
    color: GreenMain[500],
  },
  btnContentOutline: {
    fontSize: 16,
    fontWeight: "400",
    color: white[50],
  },
  scroller: {
    backgroundColor: white[50],
  },
  mainTitle: {
    paddingHorizontal: 5,
    paddingVertical:8
  },
  modalWrapper: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 15,
    marginHorizontal: 8,
  },
  toasterContainer: {
    position: "absolute",
    top: 20,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    pointerEvents: "box-none",
  },
  title: {
    fontWeight: "400",
  },
});

export default GlobalStyles;
