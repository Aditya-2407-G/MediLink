import React, { useEffect } from "react";
import { Image, View, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";

export const TabIcon = ({ icon, color, name, focused }) => {
    const translateY = useSharedValue(focused ? 0 : -10);
    const opacity = useSharedValue(focused ? 1 : 0);
    const iconSize = useSharedValue(focused ? 34 : 28);

    useEffect(() => {
        // Use withTiming for smooth transitions
        translateY.value = withTiming(focused ? -1: 0, { duration: 300 }); 
        opacity.value = withTiming(focused ? 0 : 1, { duration: 300 });
        iconSize.value = withTiming(focused ? 34 : 28, { duration: 300 });
    }, [focused]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
            width: iconSize.value,
            height: iconSize.value,
        };
    });

    const textStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Animated.View style={{ alignItems: "center", justifyContent: "center" }}>
                <Animated.Image
                    source={icon}
                    style={[animatedIconStyle, { tintColor: color }]}
                />
                {!focused && (
                    <Animated.Text style={[{ color: color, fontSize: 10, marginTop: 4 }, textStyle]}>
                        {name}
                    </Animated.Text>
                )}
            </Animated.View>
        </View>
    );
};
