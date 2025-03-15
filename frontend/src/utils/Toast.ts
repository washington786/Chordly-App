import Toast from "react-native-toast-message";

export const showToast = ({
  type,
  message,
  title,
}: {
  type: "success" | "error";
  message: string;
  title: string;
}) => {
  Toast.show({
    type: type,
    text1: title,
    text2: message,
    autoHide: true,
    swipeable: true,
    visibilityTime: 5000,
    position: "top",
    topOffset: 0,
  });
};
