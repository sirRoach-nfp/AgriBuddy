
import { Text,View } from "react-native"
import { StyleSheet } from "react-native"
import { Link } from "expo-router"
export default function App(){


    return(
        <View>

            <Text>
                Welcome to agribuddy
            </Text>

            <Link href='/(main)/home'>Continue</Link>
        </View>
    )
}