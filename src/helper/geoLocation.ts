import { Alert, Linking, PermissionsAndroid } from "react-native"
import { DisplayToast, logMsg } from "./utils";
// import Geolocation from "@react-native-community/geolocation"
import Geolocation from 'react-native-geolocation-service'

export interface LocationResult {
    UserLatitude: number,
    UserLongitude: number,
    position: any
}

const locationoptions = {
    enableHighAccuracy: true,
    timeout: 30000,
    maximumAge: 15000,
}

export const requestLocationPermission = async () => {
    try {
        let granted: boolean | string = false

        granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        if (!granted) {
            granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        }

        logMsg("requestLocationPermission --> " + granted)

        return ("granted" || granted)
    } catch (error) {
        logMsg(error)
        return false
    }
}

export async function CheckLocationPermission() {
    return new Promise<boolean>(async (resolve) => {
        const isPermissionGranted: boolean | string = await requestLocationPermission()
        logMsg("CheckLocationPermission -- " + isPermissionGranted)

        switch (isPermissionGranted) {
            case ('granted' || true):
                resolve(true)
                break;
            case 'denied':
            case 'never_ask_again':
            case 'disabled':
            case 'restricted':
                Alert.alert('', 'Location Permission Required.', [
                    {
                        text: 'Cancel',
                        onPress: () => logMsg('Cancel'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: () => {
                            Linking.openSettings()
                        }
                    },
                ]);
                resolve(false)
                break

            default:
                DisplayToast('Retry again')
                resolve(false)
                break
        }
    })
}


export async function grantLocationPermission() {
    return new Promise<LocationResult | null>(async (resolve) => {
        const isPermissionGranted: boolean | string = await requestLocationPermission()
        logMsg("isPermissionGranted from getlocation -- " + JSON.stringify(isPermissionGranted))

        switch (isPermissionGranted) {
            case ('granted' || true):
                Geolocation.getCurrentPosition((position) => {
                    if (position?.coords) {
                        const { coords } = position;
                        const mdata: LocationResult = {
                            UserLatitude: coords?.latitude,
                            UserLongitude: coords?.longitude,
                            position: position
                        };
                        resolve(mdata)
                    }
                }, (err) => {
                    resolve(null)
                }, locationoptions)
                break;
            case 'denied':
            case 'never_ask_again':
            case 'disabled':
            case 'restricted':
                Alert.alert('', 'Location Permission Required', [
                    {
                        text: 'Cancel',
                        onPress: () => logMsg('Cancel'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: () => {
                            Linking.openSettings()
                        }
                    },
                ])
                resolve(null)
                break
            default:
                resolve(null)
                break
        }
    })
}