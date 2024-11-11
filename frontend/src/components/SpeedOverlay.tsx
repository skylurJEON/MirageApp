import React  from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Canvas, Text, useFont, Paint } from '@shopify/react-native-skia';

interface SpeedOverlayProps {
  people: Array<{
    xm: number;
    ym: number;
    speed: number;
  }>;
}

export const SpeedOverlay = ({ people }: SpeedOverlayProps) => {
  // 폰트 로드
  const font = useFont(Platform.select({ ios: "Arial", default: "serif" }), 24);
  
  if (!font) {
    return null;
  }

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {people.map((person, index) => (
        <Text
          key={index}
          x={person.xm}
          y={person.ym - 10}
          text={`${person.speed?.toFixed(1) || 0} km/h`}
          font={font}
          color="white"
        />
      ))}
    </Canvas>
  );
};