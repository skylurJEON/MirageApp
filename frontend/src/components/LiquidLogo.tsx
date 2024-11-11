import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LiquidButton = () => {
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const animatedValue3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      return Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue1, {
              toValue: 1,
              duration: 18000,
              useNativeDriver: false,
              easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
            }),
            Animated.timing(animatedValue1, {
              toValue: 0,
              duration: 18000,
              useNativeDriver: false,
              easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
            })
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue2, {
              toValue: 1,
              duration: 18000,
              useNativeDriver: false,
              easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
            }),
            Animated.timing(animatedValue2, {
              toValue: 0,
              duration: 18000,
              useNativeDriver: false,
              easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
            })
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue3, {
              toValue: 1,
              duration: 8500,
              useNativeDriver: false,
              easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
            }),
            Animated.timing(animatedValue3, {
              toValue: 0,
              duration: 8500,
              useNativeDriver: false,
              easing: Easing.bezier(0.445, 0.05, 0.55, 0.95),
            })
          ])
        ),
      ]);
    };

    const animation = startAnimation();
    animation.start();

    return () => {
      animation.stop();
      animatedValue1.setValue(0);
      animatedValue2.setValue(0);
      animatedValue3.setValue(0);
    };
  }, []);

  const topLeftRadius = Animated.add(
    animatedValue1.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [120, 140, 160, 140, 120, 120],
    }),
    animatedValue2.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-15, 15, -15],
    })
  );

  const topRightRadius = Animated.add(
    animatedValue2.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [90, 70, 110, 130, 90, 90],
    }),
    animatedValue3.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-10, 10, -10],
    })
  );

  const bottomLeftRadius = Animated.add(
    animatedValue3.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [50, 30, 70, 50, 30, 50],
    }),
    animatedValue1.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-12, 12, -12],
    })
  );

  const bottomRightRadius = Animated.add(
    animatedValue2.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [70, 90, 50, 70, 90, 70],
    }),
    animatedValue3.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-10, 10, -10],
    })
  );

  const rotate = animatedValue1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['8deg', '12deg', '8deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.buttonShadow,
          {
            transform: [{ rotate }],
          }
        ]}>
        <Animated.View
          style={[
            styles.button,
            {
              borderTopLeftRadius: topLeftRadius,
              borderTopRightRadius: topRightRadius,
              borderBottomLeftRadius: bottomLeftRadius,
              borderBottomRightRadius: bottomRightRadius,
              overflow: 'hidden',
            },
          ]}>
          <LinearGradient
            colors={[
              '#FFE4E1',
              '#FFB6C1',
            ]}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={[
              '#DDA0DD',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.7 }}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={[
              'rgba(255, 182, 193, 0.4)',
              'transparent',
              'transparent'
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.text}>Mirage</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonShadow: {
    width: 180,
    height: 140,
    //backgroundColor: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    letterSpacing: 8,
    textTransform: 'uppercase',
    transform: [{ rotate: '-10deg' }],
    zIndex: 1,
  },
});

export default LiquidButton;
