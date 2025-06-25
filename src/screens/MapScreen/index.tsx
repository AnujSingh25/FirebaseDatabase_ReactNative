import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { RootStackParamList } from '../../route/screens';
import Footer from '../../components/molecules/Footer';
import { grantLocationPermission } from '../../helper/geoLocation';
import { firestore } from '../../services/firebase';
import { AppColor } from '../../theme/AppColor';
import { WIDTH } from '../../helper/utils';
import Svg, { Image, Rect } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'MapScreen'>

export default function MapScreen({ navigation, route }: Props) {
    const [MarkerData, setMarkerData] = useState<any[]>([])
    const [coordinate, setCoordinate] = useState<{ latitude: number, longitude: number }>({ latitude: 0, longitude: 0 })

    useEffect(() => {
        CurrentLocation()
        const unsubscribe = firestore()
            .collection('photos')
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setMarkerData(data)
            });

        return () => unsubscribe()
    }, [])

    const CurrentLocation = async () => {
        try {
            await grantLocationPermission().then(async (mresult) => {
                if (mresult) {
                    console.log(mresult)
                    setCoordinate({
                        latitude: Number(mresult.UserLatitude),
                        longitude: Number(mresult.UserLongitude),
                    })
                }
            }).catch((err) => {
                console.log("grantLocationPermission - MapSCreen ->", err)
            })
        } catch (error) {
            console.log("CurrentLocation - MapSCreen ==>", error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, (coordinate.latitude == 0 && coordinate.longitude == 0) && { alignItems: 'center', justifyContent: 'center' }]}>
                {(coordinate.latitude != 0 && coordinate.longitude != 0) ?
                    <MapView
                        style={{ ...StyleSheet.absoluteFillObject }}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: Number(coordinate.latitude),
                            longitude: Number(coordinate.longitude),
                            latitudeDelta: 0.02,
                            longitudeDelta: 0.02,
                        }}
                        onRegionChange={(res) => {
                            setCoordinate({ latitude: Number(res.latitude), longitude: Number(res.longitude) })
                        }}
                        scrollEnabled={true}
                        zoomTapEnabled={true}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        zoomEnabled={true}
                        zoomControlEnabled={true}
                        pitchEnabled={true}
                        focusable={true}
                        showsScale={true}
                    >
                        {MarkerData.map(item => {
                            return (
                                <Marker
                                    key={item.id}
                                    coordinate={item.location}
                                    title={"You are here"}
                                    description={new Date(item.timestamp).toLocaleDateString()}
                                    tracksViewChanges={true}
                                    draggable={true}
                                    isPreselected={true}
                                    centerOffset={{ x: -18, y: -60 }}
                                    anchor={{ x: 0.69, y: 1 }}
                                >
                                    <Callout tooltip>
                                        <View >
                                            <Svg width={WIDTH() * 0.12} height={WIDTH() * 0.12}>
                                                <Rect
                                                    x={0}
                                                    y={0}
                                                    width="100%"
                                                    height="100%"
                                                    fill={AppColor.WHITE}
                                                />
                                                <Image
                                                    href={`data:image/png;base64,${item.image}`}
                                                    width={WIDTH() * 0.12 - 4}
                                                    height={WIDTH() * 0.12 - 4}
                                                    x={2}
                                                    y={2}
                                                />
                                            </Svg>
                                        </View>
                                    </Callout>
                                </Marker>
                            )
                        })}
                    </MapView>
                    :
                    <View style={styles.emptybox}>
                        <Text style={styles.emptytext}>{"Fetching location..."}</Text>
                    </View>
                }
            </View>
            <Footer navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: AppColor.FOOTER },
    image: { width: WIDTH() * 0.12, height: WIDTH() * 0.12, borderRadius: 6, borderWidth: 1, borderColor: AppColor.WHITE, position: 'absolute', zIndex: 1000 },
    emptybox: { alignItems: 'center', justifyContent: 'center' },
    emptytext: { paddingBottom: 10, fontSize: 20, fontWeight: 'bold', marginTop: 20, color: AppColor.WHITE }
})