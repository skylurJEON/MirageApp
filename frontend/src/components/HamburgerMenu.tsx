import React, { useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface HamburgerMenuProps {
  onPress: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onPress }) => {
  const [isChecked, setIsChecked] = useState(false);
  
  const topBarAnim = useRef(new Animated.Value(0)).current;
  const middleBarAnim = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isChecked ? 0 : 1;
    setIsChecked(!isChecked);
    onPress();

    Animated.parallel([
      Animated.timing(topBarAnim, {
        toValue,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(middleBarAnim, {
        toValue,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(bottomBarAnim, {
        toValue,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleMenu}>
      <Animated.View
        style={[
          styles.bar,
          styles.halfBar,
          {
            transform: [
              {
                rotate: topBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '225deg'],
                }),
              },
              {
                translateX: topBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -18],
                }),
              },
              {
                translateY: topBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          styles.fullBar,
          {
            transform: [
              {
                rotate: middleBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-45deg'],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          styles.halfBar,
          styles.rightAligned,
          {
            transform: [
              {
                rotate: bottomBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '225deg'],
                }),
              },
              {
                translateX: bottomBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 18],
                }),
              },
              {
                translateY: bottomBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 4],
                }),
              },
            ],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    gap: 8,
    padding: 4,
    //backgroundColor: 'gray',
    borderRadius: 20,
  },
  bar: {
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  halfBar: {
    width: '50%',
  },
  fullBar: {
    width: '100%',
  },
  rightAligned: {
    alignSelf: 'flex-end',
  },
});

export default HamburgerMenu;