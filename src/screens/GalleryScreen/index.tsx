import React, { useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View, Linking, StyleSheet, SafeAreaView } from 'react-native'
import { firestore } from '../../services/firebase'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../route/screens';
import Footer from '../../components/molecules/Footer';
import { HEIGHT, WIDTH } from '../../helper/utils';
import { AppColor } from '../../theme/AppColor';
import { SvgUrls } from '../../helper/svgUrls';

type Props = NativeStackScreenProps<RootStackParamList, 'GalleryScreen'>;

interface ResultProp {
    id: any
    image: string
    location: { latitude: number, longitude: number }
    timestamp: number
}

export default function GalleryScreen({ navigation, route }: Props) {
    const [data, setData] = useState<ResultProp[]>([])

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('photos')
            .orderBy('timestamp', 'desc')
            .onSnapshot(snapshot => {
                const res: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setData(res)
            });

        return () => unsubscribe()
    }, [])

    const openInMaps = (lat: number, lng: number) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        //  android: `geo:${lat},${long}?q=${lat},${long}(${"title1 : " + title2})`,
        Linking.openURL(url)
    };

    const renderItem = (({ item, index }: any) => {
        return (
            <TouchableOpacity onPress={() => openInMaps(item.location.latitude, item.location.longitude)} style={styles.flatlistbox}>
                <View key={index} style={styles.flatlistinnerbox}>
                    <Image
                        style={styles.image}
                        source={{ uri: `data:image/png;base64,${item.image}` }}
                    />
                    <View style={styles.flexbox}>
                        <SvgUrls.Time height={50} width={35} />
                        <View style={{ marginStart: 7 }} >
                            <Text style={styles.text}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                        </View>
                    </View>

                    <View style={styles.flexbox}>
                        <SvgUrls.Location height={50} width={35} />
                        <View style={{ marginStart: 7 }} >
                            <Text style={styles.text}>Lat: {item.location.latitude}</Text>
                            <Text style={styles.text}>Lng: {item.location.longitude}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    })

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    numColumns={2}
                    ListEmptyComponent={() => {
                        return (<View style={styles.emptybox}>
                            <Text style={styles.emptytext}>{"No Data Found..."}</Text>
                        </View>)
                    }}
                />
            </View>
            <Footer navigation={navigation} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppColor.FOOTER },
    card: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
    image: { width: WIDTH() * 0.4, height: HEIGHT() * 0.2, borderRadius: 10 },
    text: { marginTop: 5, color: AppColor.BLACK },
    emptybox: { alignItems: 'center', justifyContent: 'center', marginTop: HEIGHT() / 2.5 },
    emptytext: { paddingBottom: 10, fontSize: 20, fontWeight: 'bold', marginTop: 20, color: AppColor.WHITE },
    flatlistbox: { alignItems: 'center', margin: 2, flex: 1, elevation: 2 },
    flatlistinnerbox: { margin: 5, padding: 10, backgroundColor: AppColor.WHITE, borderRadius: 8 },
    flexbox: { flexDirection: 'row', alignItems: 'center' }
})