import React, { ReactElement, FC } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';

interface props {
    visible: boolean
}

const APILoader: FC<props> = ({ visible }): ReactElement => {
    return (
        <Modal visible={visible} transparent presentationStyle='overFullScreen' style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: "rgba(255,255,255, 0.1)" }}>
                <ActivityIndicator size={"large"} />
            </View>
        </Modal>
    );
};

export default APILoader