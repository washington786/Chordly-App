import { StyleSheet } from "react-native";
import React, { useState } from "react";
import Gradient from "@components/Gradient";
import KeyboardAvoidanceView from "@components/KeyboardAvoidanceView";
import Header from "@components/auth/Header";
import { Formik, FormikHelpers } from "formik";
import Input from "@components/auth/Input";
import InputError from "@components/auth/InputError";
import { Button, Text, TextInput } from "react-native-paper";
import { white } from "@styles/Colors";
import GlobalStyles from "@styles/GlobalStyles";
import InputWrapper from "@components/auth/InputWrapper";
import { signInValidationSchema } from "@utils/SignUpValidationSchema";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthPropTypes } from "src/@types/AuthPropTypes";
import client from "src/api/client";

interface SignInDoc {
  email: string;
  password: string;
}

const initialValues = {
  email: "",
  password: "",
};
const SignIn = () => {
  const [toggle, setToggle] = useState<Boolean>(false);
  const navigation = useNavigation<NavigationProp<AuthPropTypes>>();

  function handleCreateAccount() {
    navigation.navigate("signUp");
  }
  function handleForgotPassword() {
    navigation.navigate("resetPassword");
  }

  async function handleSubmit(
    values: SignInDoc,
    actions: FormikHelpers<SignInDoc>
  ) {
    try {
      const res = await client.post("/auth/login", { ...values });

      if (res.status === 200) {
        const { data } = res;
        console.log(data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Login Error:", error);
      console.log("====================================");
    }
  }
  return (
    <Gradient>
      <KeyboardAvoidanceView>
        <Header
          title="Welcome Back!"
          description="Enter your credentials to login."
        />
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={signInValidationSchema}
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
                <Text style={styles.fgt} onPress={handleForgotPassword}>
                  forgot your password?
                </Text>
                <Button
                  mode="contained"
                  uppercase
                  labelStyle={[GlobalStyles.btnContent]}
                  style={[GlobalStyles.button]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {!isSubmitting ? "sign in" : "submitting..."}
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
          onPress={handleCreateAccount}
        >
          create an account
        </Button>
      </KeyboardAvoidanceView>
    </Gradient>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  fgt: {
    marginVertical: 12,
    color: "white",
    textTransform: "capitalize",
  },
});
