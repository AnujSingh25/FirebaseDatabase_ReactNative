import { Dimensions, PermissionsAndroid, ToastAndroid } from "react-native"

export function WIDTH() {
    return Dimensions.get('screen').width
}

export function HEIGHT() {
    return Dimensions.get('screen').height
}

export const logMsg = (msg1: string | any) => {
    __DEV__ && console.log(msg1)
}

export function DisplayToast(msg: string) {
    if (msg) {
        ToastAndroid.show(msg, 300)
    }
}

export const requestCameraPermission = async () => {
    const permissionOption = {
        title: 'Camera Permission',
        message: 'App needs camera permission',
        buttonPositive: 'Ok'
    }
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, permissionOption)
    return granted === PermissionsAndroid.RESULTS.GRANTED
}