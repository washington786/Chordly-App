import React, { useState } from "react";
import KeyboardAvoidanceView from "@components/KeyboardAvoidanceView";
import { Button, TextInput } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";
import Gradient from "@components/Gradient";
import Header from "@components/auth/Header";
import Input from "@components/auth/Input";
import { Formik } from "formik";
import { signUpValidationSchema } from "@utils/SignUpValidationSchema";
import InputError from "@components/auth/InputError";
import InputWrapper from "@components/auth/InputWrapper";
import { white } from "@styles/Colors";
import { useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation();
  const [toggle, setToggle] =
    useState<Boolean>(false); /* for toggling the password visibility. */

  const screen = "sign-in" as never;
  function handleSignAccount() {
    navigation.navigate(screen);
  }
  return (
    <Gradient>
      <KeyboardAvoidanceView>
        <Header
          title="Welcome!"
          description="Let's get started by creating an account."
        />

        <Formik
          initialValues={initialVals}
          onSubmit={(value) => {
            console.log("====================================");
            console.log(value);
            console.log("====================================");
          }}
          validationSchema={signUpValidationSchema}
        >
          {({ handleSubmit, touched, values, handleChange, errors }) => (
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
                onPress={() => handleSubmit()}
              >
                create account
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
