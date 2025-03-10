import React from "react";
import Gradient from "@components/Gradient";
import KeyboardAvoidanceView from "@components/KeyboardAvoidanceView";
import Header from "@components/auth/Header";
import { Formik, FormikHelpers } from "formik";
import { ForgotPassValidationSchema } from "@utils/SignUpValidationSchema";
import InputWrapper from "@components/auth/InputWrapper";
import Input from "@components/auth/Input";
import InputError from "@components/auth/InputError";
import { Button } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthPropTypes } from "src/@types/AuthPropTypes";
import client from "src/api/client";
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";

interface Auth {
  email: string;
}

const initialValues = {
  email: "",
};
const ForgotPassword = () => {
  const navigation = useNavigation<NavigationProp<AuthPropTypes>>();

  function handleBack() {
    navigation.goBack();
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

  async function handleSubmit(values: Auth, action: FormikHelpers<Auth>) {
    try {
      const res = await client.post("/auth/forgot-password", {
        email: values.email,
      });
      if (res.status === 200) {
        navigation.navigate("signIn");
      }
    } catch (error) {
      console.log("forgot password: ", error);
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
          title="Forgot Password"
          description="Oops, did you forget your password? Don't worry, we'll help you get back in."
        />
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={ForgotPassValidationSchema}
        >
          {({
            values,
            errors,
            handleChange,
            handleSubmit,
            touched,
            isSubmitting,
          }) => {
            return (
              <InputWrapper>
                <Input
                  placeholder="Email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  error={errors.email ? true : false}
                  autoCorrect={false}
                />
                {errors.email && touched && (
                  <InputError errorMessage={errors.email} />
                )}

                <Button
                  mode="contained"
                  uppercase
                  labelStyle={[GlobalStyles.btnContent]}
                  style={[GlobalStyles.button]}
                  onPress={() => handleSubmit()}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {!isSubmitting ? "send link" : "Submitting..."}
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
          onPress={handleBack}
        >
          back to sign in
        </Button>
      </KeyboardAvoidanceView>
    </Gradient>
  );
};

export default ForgotPassword;
