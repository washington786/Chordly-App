import React, { useState } from "react";
import KeyboardAvoidanceView from "@components/KeyboardAvoidanceView";
import { Button, TextInput } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";
import Gradient from "@components/Gradient";
import Header from "@components/auth/Header";
import Input from "@components/auth/Input";
import { Formik, FormikHelpers } from "formik";
import { signUpValidationSchema } from "@utils/SignUpValidationSchema";
import InputError from "@components/auth/InputError";
import InputWrapper from "@components/auth/InputWrapper";
import { white } from "@styles/Colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import client from "src/api/client";
import { AuthPropTypes } from "src/@types/AuthPropTypes";
import { updateLoggedIn, updateProfile } from "src/store/auth";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";

interface Auth {
  name: string;
  email: string;
  password: string;
}

const initialVals: Auth = {
  name: "",
  email: "",
  password: "",
};

const SignUp = () => {
  const dispatch = useDispatch();
  const [toggle, setToggle] =
    useState<Boolean>(false); /* for toggling the password visibility. */

  const navigation = useNavigation<NavigationProp<AuthPropTypes>>();

  function handleSignAccount() {
    navigation.navigate("signIn");
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

  async function handleSubmit(values: Auth, actions: FormikHelpers<Auth>) {
    try {
      // 192.168.0.221
      const { data } = await client.post("/auth/register", {
        ...values,
      });

      if (data) {
        dispatch(updateProfile(data.user));
        dispatch(updateLoggedIn(false));
        navigation.navigate("verification", {
          userInfo: data.user,
          message: data.message,
        });
      }
    } catch (error) {
      console.log("sign up error: ", error);
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
          title="Welcome!"
          description="Let's get started by creating an account."
        />

        <Formik
          initialValues={initialVals}
          onSubmit={handleSubmit}
          validationSchema={signUpValidationSchema}
        >
          {({
            handleSubmit,
            touched,
            values,
            handleChange,
            errors,
            isSubmitting,
          }) => (
            <InputWrapper>
              <Input
                placeholder="Username"
                keyboardType="default"
                textContentType="name"
                autoCapitalize="none"
                value={values.name}
                onChangeText={handleChange("name")}
                error={errors.name ? true : false}
                autoCorrect={false}
              />
              {errors.name && touched && (
                <InputError errorMessage={errors.name} />
              )}
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
              <Input
                placeholder="Password"
                keyboardType="visible-password"
                textContentType="password"
                secureTextEntry={!toggle ? true : false}
                autoCapitalize="none"
                value={values.password}
                onChangeText={handleChange("password")}
                error={errors.password ? true : false}
                autoCorrect={false}
                right={
                  <TextInput.Icon
                    icon={!toggle ? "eye" : "eye-off"}
                    color={white[100]}
                    onPress={() => setToggle(!toggle)}
                  />
                }
              />
              {errors.password && touched && (
                <InputError errorMessage={errors.password} />
              )}

              <Button
                mode="contained"
                uppercase
                labelStyle={[GlobalStyles.btnContent]}
                style={[GlobalStyles.button]}
                loading={isSubmitting}
                disabled={isSubmitting}
                onPress={() => handleSubmit()}
              >
                {!isSubmitting ? "create account" : "submitting..."}
              </Button>
            </InputWrapper>
          )}
        </Formik>

        <Button
          mode="outlined"
          uppercase
          labelStyle={[GlobalStyles.btnContentOutline]}
          style={[GlobalStyles.buttonOutline]}
          onPress={handleSignAccount}
        >
          sign in
        </Button>
      </KeyboardAvoidanceView>
    </Gradient>
  );
};

export default SignUp;
