import { StatusBar } from "expo-status-bar";
import { Tabs } from "expo-router";
import { icons } from "../../constants";
import { TabIcon } from "../../components/TabIcon";

const TabLayout = () => {
    return (
        <>
            <StatusBar backgroundColor="#161622" style="light" />
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#3A83F4",
                    tabBarInactiveTintColor: "#CDCDE0",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        height: 70,
                        borderRadius: 35, 
                        position: "absolute",
                        bottom:20,
                        left: 20,
                        right: 20,
                        shadowColor: "#000", 
                        shadowOffset: { width: 0, height: 2 }, 
                        shadowOpacity: 0.3, 
                        shadowRadius: 4, 
                    },
                }}
            >
                <Tabs.Screen
                    name="Home"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Home"
                                focused={focused}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="Appointments"
                    options={{
                        title: "Appointments",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.calendar}
                                color={color}
                                name="Appointments"
                                focused={focused}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="AISeek"
                    options={{
                        title: "AISeek",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.Crystal}
                                color={color}
                                name="AI Seek"
                                focused={focused}
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
};

export default TabLayout;
