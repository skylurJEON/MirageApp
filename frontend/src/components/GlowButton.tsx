import React from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GlowButtonProps {
  title: string;
  onPress?: () => void;
  duration: number;
  isAnimated: boolean;
  onAnimationComplete?: () => void;
}

const GlowButton: React.FC<GlowButtonProps> = ({ title, onPress, duration, isAnimated, onAnimationComplete }) => {
  const rotationValue = React.useRef(new Animated.Value(0)).current;
  const rotationCount = React.useRef(0);
  const animationRef = React.useRef<Animated.CompositeAnimation | null>(null);

  React.useEffect(() => {
    if (!isAnimated) {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      rotationValue.setValue(0);
      rotationCount.current = 0;
      return;
    }

    if (isAnimated) {
      rotationCount.current = 0;
      rotationValue.setValue(0);
      
      const animate = () => {
        const animation = Animated.timing(rotationValue, {
          toValue: 400,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
          isInteraction: false,
        });

        animationRef.current = animation;

        animation.start(({ finished }) => {
          if (finished) {
              rotationValue.setValue(0);
              animate();
            
          }
        });
      };

      animate();
    }

    // return () => {
    //   if (animationRef.current) {
    //     animationRef.current.stop();
    //     animationRef.current = null;
    //   }
    //   rotationValue.setValue(0);
    //   rotationCount.current = 0;
    // };
  }, [isAnimated, duration]);

  const spin = rotationValue.interpolate({
    inputRange: [0, 400],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <View style={styles.back}>
          <Animated.View 
            style={[
              styles.backGradientContainer, 
              isAnimated 
                ? { transform: [{ rotate: spin }] }
                : { transform: [{ rotate: '45deg' }] }
            ]}
          >
            <LinearGradient
              colors={[
                'transparent',
                isAnimated ? 'transparent' : '#FFB6C1',
                '#FFB6C1',
                '#DDA0DD',
                isAnimated ? 'transparent' : '#DDA0DD',
                'transparent'
              ]}
              locations={isAnimated ? [0, 0.2, 0.4, 0.6, 0.8, 1] : [0, 0.3, 0.4, 0.6, 0.7, 1]}
              style={[
                styles.backGradient,
                isAnimated 
                  ? { transform: [{ rotate: '-45deg' }] }
                  : { transform: [{ rotate: '-45deg' }] }
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
          <View style={[
            styles.backContent,
            !isAnimated && { backgroundColor: 'black' }
          ]}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '70%',
    height: '13%',
    padding: 10,
    borderRadius: 15,
  },
  content: {
    width: '100%',
    height: '100%',
    padding: 10,
    borderRadius: 15,
    //backgroundColor: '#151515',
    overflow: 'hidden',
  },
  back: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  backGradientContainer: {
    position: 'absolute',
    width: '280%',
    height: '280%',
    top: '-90%',
    left: '-90%',
  },
  backGradient: {
    width: '100%',
    height: '100%',
  },
  backContent: {
    position: 'relative',
    width: '99%',
    height: '96%',
    backgroundColor: 'black',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1%',
  },
  front: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  frontContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 10,
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    color: 'white',
    alignSelf: 'flex-start',
  },
  description: {
    width: '100%',
    padding: 10,
    //backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    color: 'white',
    fontSize: 14,
    //fontWeight: 'bold',
  },
  strongText: {
    color: 'white',
    fontSize: 14,
    //fontWeight: 'bold',
  },
  cardFooter: {
    //color: 'rgba(255,255,255,0.5)',
    marginTop: 5,
    fontSize: 12,
  },
});

export default GlowButton;