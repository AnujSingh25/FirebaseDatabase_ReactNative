import React from 'react';
import { SafeAreaView } from 'react-native'
import RootNavigator from './route/navigation';

function App(): React.JSX.Element {
  //  <!-- android:value="AIzaSyClUiOpNfQcWvVXuz4BeC2nWHc-gZQ9Jis" -->
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RootNavigator />
    </SafeAreaView>
  );
}

export default App