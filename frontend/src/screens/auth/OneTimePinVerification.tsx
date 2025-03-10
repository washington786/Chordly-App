import React, { useEffect, useRef, useState } from "react";
import Gradient from "@components/Gradient";
import KeyboardAvoidanceView from "@components/KeyboardAvoidanceView";
import Header from "@components/auth/Header";
import { Formik } from "formik";
import InputWrapper from "@components/auth/InputWrapper";
import { OtpValidationSchema } from "@utils/SignUpValidationSchema";
import InputError from "@components/auth/InputError";
import { Button } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { AuthPropTypes } from "src/@types/AuthPropTypes";
import client from "src/api/client";
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";

const initialValues = {
  otp: "",
};

type Props = RouteProp<AuthPropTypes, "verification">;

const OneTimePinVerification = () => {
  const { params } = useRoute<Props>();
  const { userInfo, message } = params;

  console.log("userInfo: ", userInfo);
  console.log("message: ", message);

  const otp = useRef<OtpInputRef>(null);

  const navigation = useNavigation<NavigationProp<AuthPropTypes>>();

  //   timer
  const [canResend, setCanResend] = useState<Boolean>(false);
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const timeout = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timeout);
  }, [timer]);

  async function handleSubmit(values: { otp: string }) {
    try {
      const res = await client.post("/auth/verify-email", {
        userId: userInfo?._id,
        token: values.otp,
      });

      if (res.status === 200) {
        otp.current?.clear;
        otp.current?.setValue("");

        if (res.data.message === "Email verified successfully") {
          navigation.navigate("signIn");
        }
      }
    } catch (error) {
      console.log("verification error: ", error);
    }
  }

  const showToast = ({
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

  async function handleReverify() {
    setCanResend(false);
    setTimer(60);
    try {
      await client.post("/auth/re-verify", {
        userId: userInfo?._id.toString(),
      });
    } catch (error) {
      console.log("re-verify error: ", error);
      if (isAxiosError(error)) {
        showToast({
          type: "error",
          message: error?.response?.data?.message,
          title: "Error",
        });
      }
      showToast({ type: "error", message: error as string, title: "Error" });
    }
  }

  return (
    <Gradient>
      <KeyboardAvoidanceView>
        <Toast />
        <Header
          title="Verify Email"
          description="Please check your emails for OTP."
        />
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={OtpValidationSchema}
        >
          {({ errors, setFieldValue, handleSubmit, touched, isSubmitting }) => {
            return (
              <InputWrapper>
                <OtpInput
                  autoFocus
                  numberOfDigits={6}
                  type="numeric"
                  focusColor={"white"}
                  onTextChange={(text) => setFieldValue("otp", text)}
                  ref={otp}
                  theme={{
                    pinCodeContainerStyle: { backgroundColor: "white" },
                    containerStyle: {
                      marginVertical: 8,
                    },
                  }}
                />
                {errors.otp && touched && (
                  <InputError errorMessage={errors.otp} />
                )}

                <Button
                  mode="contained"
                  uppercase
                  labelStyle={[GlobalStyles.btnContent]}
                  style={[GlobalStyles.button]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {!isSubmitting ? "submit" : "submitting..."}
                </Button>
              </InputWrapper>
            );
          }}
        </Formik>
        <Button
          mode="outlined"
          uppercase
          labelStyle={[GlobalStyles.btnContentOutline]}
          style={[GlobalStyles.buttonOutline]}
          onPress={handleReverify}
          disabled={!canResend}
        >
          {canResend ? "resent otp" : `resend in ${timer} seconds`}
        </Button>
      </KeyboardAvoidanceView>
    </Gradient>
  );
};

export default OneTimePinVerification;
