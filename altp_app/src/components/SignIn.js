import React, {useEffect, useState} from "react";
import {ImageBackground, StyleSheet, Text, View, Image} from "react-native";
import Button from "../elements/Button";

export default SignIn = () => {

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/imgs/background.jpg')} resizeMode="cover"
                             style={styles.image}>
                <Image
                    style={styles.logoImg}
                    source={require('../../assets/imgs/logo.png')}
                />
                <Button/>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoImg: {
        width: 300,
        height: 300
    },
    image: {
        flex: 1,
        alignItems: 'center'
    },
});