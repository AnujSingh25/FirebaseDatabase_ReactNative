import React, { useEffect, useState } from 'react'
import { Image, View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { launchCamera } from 'react-native-image-picker'
import { firestore, storage } from '../../services/firebase'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../route/screens'
import Footer from '../../components/molecules/Footer'
import { DisplayToast, HEIGHT, logMsg, requestCameraPermission, WIDTH } from '../../helper/utils'
import { SvgUrls } from '../../helper/svgUrls'
import { AppColor } from '../../theme/AppColor'
import { grantLocationPermission } from '../../helper/geoLocation'
import APILoader from '../../components/atom/loader'
const RNFS = require('react-native-fs')

type Props = NativeStackScreenProps<RootStackParamList, 'UploadScreen'>

export default function UploadScreen({ navigation, route }: Props) {
    const [img, setImg] = useState<string | null>(null)
    const [Coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)
    const [loader, setLoader] = useState(false)

    useEffect(() => { setImg(null), setCoordinates(null), setLoader(false) }, [])

    const CurrentLocation = async () => {
        try {
            await grantLocationPermission().then(async (mresult) => {
                if (mresult) {
                    logMsg(mresult)
                    setCoordinates({
                        latitude: Number(mresult.UserLatitude),
                        longitude: Number(mresult.UserLongitude),
                    })
                }
            }).catch((err) => {
                logMsg("CurrentLocation - UploadScreen ->" + err)
            })
        } catch (error) {
            logMsg("CurrentLocation error UploadScreen-->" + error)
        }
    }

    const captureImage = async () => {
        try {
            const locationPermission = await CurrentLocation()
            const cameraPermission = await requestCameraPermission()
            if (!cameraPermission) return DisplayToast("Camera permission denied")

            const result: any = await launchCamera({ mediaType: 'photo', saveToPhotos: true })

            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0].uri
                const baseImg = await RNFS.readFile(asset, 'base64') // convert to base64
                setImg(baseImg)
            }
        } catch (error) {
            logMsg("captureImage ---->" + error)
            DisplayToast("Something went wrong")
        }
    }

    const uploadToFirebase = async () => {
        try {
            if (!img || !Coordinates) return DisplayToast("Please capture image")
            setLoader(true)

            // const filename = `photos/${Date.now()}.jpg`
            // const reference = storage().ref(filename).putFile(img)
            // logMsg("reference", reference);

            // logMsg("img", img)

            // // const putRes = await reference.putFile(img)

            // // logMsg("putRes", putRes);

            // // const url = await reference.getDownloadURL()

            // const url = await reference.on('state_changed', snapshot => {
            //     logMsg("snapshot", snapshot);
            // });

            const res = await firestore().collection('photos').add({
                image: img,
                location: {
                    latitude: Coordinates.latitude,
                    longitude: Coordinates.longitude,
                },
                timestamp: Date.now()
            })

            logMsg("uploadToFirebase ===>" + res)

            DisplayToast("Uploaded Image Successfully")
        } catch (error) {
            logMsg("uploadToFirebase---> " + error)
            DisplayToast("Something went wrong")
        } finally {
            setImg(null)
            setCoordinates(null)
            setLoader(false)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <APILoader visible={loader} />
                <View style={styles.innercontainer}>
                    <View style={{ ...styles.card, height: (!img || !Coordinates) ? HEIGHT() * 0.35 : HEIGHT() * 0.55 }}>
                        {(!img || !Coordinates) ?
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <SvgUrls.Camera height={HEIGHT() * 0.1} width={WIDTH() * 0.3} onPress={captureImage} />
                                <Text style={{ ...styles.text, marginTop: 20 }}>Capture Your Image</Text>
                            </View>
                            :
                            <View style={{ width: "100%", height: "100%", justifyContent: 'space-between' }}>
                                <Image source={{ uri: `data:image/png;base64,${img}` }} resizeMode='cover' style={styles.image} />
                                <Text style={styles.imgText}>Latitude: {Coordinates.latitude}</Text>
                                <Text style={styles.imgText}>Longitude: {Coordinates.longitude}</Text>
                            </View>
                        }
                    </View>
                    <TouchableOpacity style={{ ...styles.card, marginTop: 20, height: HEIGHT() * 0.07, backgroundColor: (!img || !Coordinates) ? "silver" : AppColor.BOX, }} onPress={uploadToFirebase}>
                        <Text style={styles.text}>Upload Image</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Footer navigation={navigation} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: AppColor.FOOTER },
    innercontainer: { marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
    image: { width: "100%", height: "80%", borderRadius: 10 },
    text: { color: AppColor.WHITE, fontWeight: 700, fontSize: 25, textAlign: 'center' },
    imgText: { color: AppColor.WHITE, fontWeight: 500, fontSize: 17, textAlign: 'center' },
    card: { backgroundColor: AppColor.BOX, width: WIDTH() - 60, borderStyle: 'dashed', borderWidth: 1, borderColor: AppColor.WHITE, borderRadius: 10, padding: 5, alignItems: 'center', justifyContent: 'center' }
})