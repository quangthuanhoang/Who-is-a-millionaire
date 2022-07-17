import React from "react";
import {StyleSheet, Text, View } from "react-native";

const Triangle = (props) => {
    return <View style={[styles.triangle, props.style]} />;
  };

  const TriangleLeft = () => {
    return <Triangle style={styles.triangleLeft} />;
  };

  const TriangleRight = () => {
    return <Triangle style={styles.triangleRight} />;
  };
  
export default Button = () => {
    const childWidth = 50;
    return (
      <View style={styles.container}>
        <View style={styles.baseBottom}>
        <View style={styles.baseTop} />
            <Text>Đây là đáp 1</Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1
    },
    baseTop: {
        borderRightWidth: 35,
        borderRightColor: "green",
        borderTopWidth: 25,
        borderTopColor: "transparent",
        borderBottomWidth: 25,
        borderBottomColor: "transparent",
        height: 0,
        width: 0,
        left: -35,
        top: 0,
        position: "absolute",
      },
      baseBottom: {
        backgroundColor: "green",
        height:50,
        width: 100,
      },
});