import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { Paragraph } from 'react-native-paper'
import { red } from '@styles/Colors'

interface Input{
    errorMessage:string
}

const InputError:FC<Input> = (props) => {
  return (
    <>
      <Paragraph style={styles.txt}>{props.errorMessage}</Paragraph>
    </>
  )
}

export default InputError

const styles = StyleSheet.create({
    txt:{
        color:red[600],
        paddingVertical:5
    }
})