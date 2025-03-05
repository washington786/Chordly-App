import React from "react";
import Gradient from "@components/Gradient";
import KeyboardAvoidanceView from "@components/KeyboardAvoidanceView";
import Header from "@components/auth/Header";
import { Formik } from "formik";
import { ForgotPassValidationSchema } from "@utils/SignUpValidationSchema";
import InputWrapper from "@components/auth/InputWrapper";
import Input from "@components/auth/Input";
import InputError from "@components/auth/InputError";
import { Button } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";
import { useNavigation } from "@react-navigation/native";

const initialValues = {
  email: "",
};
const ForgotPassword = () => {
  const navigation = useNavigation();

  function handleBack() {
    navigation.goBack();
  }

  return (
    <Gradient>
      <KeyboardAvoidanceView>
        <Header
          title="Forgot Password"
          description="Oops, did you forget your password? Don't worry, we'll help you get back in."
        />
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log("====================================");
            console.log(values);
            console.log("====================================");
          }}
          validationSchema={ForgotPassValidationSchema}
        >
          {({ values, errors, handleChange, handleSubmit, touched }) => {
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
                >
                  send link
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
