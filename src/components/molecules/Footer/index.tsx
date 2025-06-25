import React, { JSX, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppColor } from '../../../theme/AppColor';
import { HEIGHT, WIDTH } from '../../../helper/utils';
import { SCREENS } from '../../../route/screens';

const Footer = ({ navigation }: any): JSX.Element => {

    const [selectedItem, setSelectedItem] = useState('')
    const route = useRoute()

    useEffect(() => {

        const routeName = route.name

        switch (routeName) {
            case 'MapScreen':
                setSelectedItem('MapScreen');
                break;
            case 'GalleryScreen':
                setSelectedItem('GalleryScreen');
                break;
            case 'UploadScreen':
                setSelectedItem('UploadScreen');
                break;
            default:
                setSelectedItem('');
        }

    }, [route, selectedItem])

    const DATA = [
        { id: 0, Title: "MapScreen", Screen: SCREENS.MapScreen },
        { id: 1, Title: "GalleryScreen", Screen: SCREENS.GalleryScreen },
        { id: 2, Title: "UploadScreen", Screen: SCREENS.UploadScreen },
    ]

    const GetTitle = (name: any) => {
        if (name == "MapScreen") return "Map"
        if (name == "GalleryScreen") return "Gallery"
        if (name == "UploadScreen") return "Upload"
        return ""
    }

    const RenderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity style={[
                selectedItem == (item.Title) ? { ...styles.footerItem2 } : styles.footerItem, { alignItems: 'center', margin: 2 }]}
                onPress={() => {
                    setSelectedItem(item.Title)
                    if (item.Screen) {
                        navigation.navigate(item.Screen)
                    }
                }}>
                <View style={{}}>
                    <Text style={{ fontSize: selectedItem == (item.Title) ? 18 : 16, color: AppColor.WHITE, fontWeight: selectedItem == (item.Title) ? 700 : 400 }}>{GetTitle(item.Title)}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.footer}>
            <FlatList
                horizontal
                data={DATA}
                renderItem={RenderItem}
                contentContainerStyle={{}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        backgroundColor: AppColor.FOOTER,
        padding: 2,
        height: HEIGHT() * 0.068,
        borderTopColor: AppColor.WHITE,
        borderTopWidth: 2
    },
    footerItem: {
        width: WIDTH() * 0.2,
        justifyContent: 'center',
    },
    footerItem2: {
        backgroundColor: AppColor.BLACK,
        width: WIDTH() * 0.55,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-evenly",
        borderColor: AppColor.WHITE,
        borderWidth: 0.4
    }
});

export default Footer