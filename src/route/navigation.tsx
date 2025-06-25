import React, { JSX } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { RootStackParamList } from './screens';
import MapScreen from '../screens/MapScreen';
import GalleryScreen from '../screens/GalleryScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UploadScreen from '../screens/UploadScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
// type Props = NativeStackScreenProps<RootStackParamList, 'RootNavigator'>;

export default function RootNavigator({ }): JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={'UploadScreen'} component={UploadScreen} options={{ headerShown: false }} />
                <Stack.Screen name={"MapScreen"} component={MapScreen} options={{ headerShown: false }} />
                <Stack.Screen name={'GalleryScreen'} component={GalleryScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}