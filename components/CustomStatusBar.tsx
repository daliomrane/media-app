import React from 'react';
import { StatusBar, View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomStatusBar = ({ backgroundColor = 'transparent', barStyle = 'default', ...props }) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'ios' ? insets.top : 0; // Adjust for iOS notch/status bar height

  return (
    <View style={[styles.statusBarBackground, { height: statusBarHeight, backgroundColor }]}>
      <StatusBar translucent backgroundColor={backgroundColor} barStyle={barStyle} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  statusBarBackground: {
    width: '100%',
    // height will be dynamically set
  },
});

export default CustomStatusBar;