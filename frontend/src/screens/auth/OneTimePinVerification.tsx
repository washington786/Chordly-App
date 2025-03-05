import React from "react";
import Gradient from "@components/Gradient";
import KeyboardAvoidanceView from "@components/KeyboardAvoidanceView";
import Header from "@components/auth/Header";
import { Formik } from "formik";
import InputWrapper from "@components/auth/InputWrapper";
import { OtpValidationSchema } from "@utils/SignUpValidationSchema";
import InputError from "@components/auth/InputError";
import { Button } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";
import { OtpInput } from "react-native-otp-entry";

const initialValues = {
  otp: "",
};

const OneTimePinVerification = () => {
  return (
    <Gradient>
      <KeyboardAvoidanceView>
        <Header
          title="Verify Email"
          description="Please check your emails for OTP."
        />
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            console.log("====================================");
            console.log(values);
            console.log("====================================");
          }}
          validationSchema={OtpValidationSchema}
        >
          {({ errors, setFieldValue, handleSubmit, touched }) => {
            return (
              <InputWrapper>
                <OtpInput
                  autoFocus
                  numberOfDigits={6}
                  type="numeric"
                  focusColor={"white"}
                  onTextChange={(text) => setFieldValue("otp", text)}
                //   ref={}
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
                >
                  submit
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
        >
          resent otp
        </Button>
      </KeyboardAvoidanceView>
    </Gradient>
  );
};

export default OneTimePinVerification;
