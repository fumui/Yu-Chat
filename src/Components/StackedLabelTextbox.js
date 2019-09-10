import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

const StackedLabelTextbox = (props) => {
  return (
    <View style={[styles.root, props.style]}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput placeholder={props.placeholder} onChangeText={props.onChangeText} style={styles.inputStyle} />
    </View>
  );
}
export default StackedLabelTextbox

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: "#D9D5DC",
    borderBottomWidth: 1
  },
  label: {
    color: "#000",
    opacity: 0.6,
    paddingTop: 16,
    fontSize: 12,
    fontFamily: "roboto-regular",
    textAlign: "left"
  },
  inputStyle: {
    flex: 1,
    color: "#000",
    alignSelf: "stretch",
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 16,
    fontFamily: "roboto-regular",
    lineHeight: 16
  }
});
