import React from "react";
import { View, Image, Text } from "react-native";
export const TabIcon = ({icon,color,name,focused,containerStyle, iconStyle}: any) => {
    
    return (
        <View className={`flex items-center justify-center ${iconStyle}`}>
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={`${containerStyle}`}

            />
            <Text
                className={`${focused ? "font-poppins-semibold" : "font-poppins-regular"} text-xs`}
                style={{ color: color }}
            >
                {name}
            </Text>
        </View>
    );
};


