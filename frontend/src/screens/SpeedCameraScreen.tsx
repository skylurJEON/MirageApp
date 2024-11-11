import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Animated, Modal, FlatList } from 'react-native';
import { Camera, useCameraDevice, useSkiaFrameProcessor, 
  useCameraPermission, runAtTargetFps, useFrameProcessor } from 'react-native-vision-camera';
import { useTensorflowModel, TensorflowModel, Tensor } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { PaintStyle, Skia, Text as SkiaText, FontStyle, Canvas, Rect, SkCanvas, Group } from '@shopify/react-native-skia';
import { runOnUI, useSharedValue, useDerivedValue, runOnJS } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { PanResponder, GestureResponderEvent } from 'react-native';
import { Worklets } from 'react-native-worklets-core';
import HamburgerMenu from '../components/HamburgerMenu';
import LoadingScreen from '../components/LoadingScreen';
import { NavigationProp } from '@react-navigation/native';
//import { SpeedOverlay } from '../components/SpeedOverlay';
//import { fetchTodayMatches, fetchPlayersByMatchId } from '../api/api'; // API 함수 추가
//import { Match, Player } from '../types/match'; // 타입 추가
//import PlayerInfoScreen from './PlayerInfoScreen';
//import { MOSSETracker } from '../utils/trackers/MOSSETracker';
//import { TrackerState } from '../utils/trackers/types';
import MatchSelectionOverlay from '../components/MatchSelectionOverlay';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const boxPaint = Skia.Paint();
boxPaint.setStyle(PaintStyle.Stroke);
boxPaint.setStrokeWidth(8);
boxPaint.setColor(Skia.Color('green'));

const textPaint = Skia.Paint();
textPaint.setStyle(PaintStyle.Fill);
textPaint.setColor(Skia.Color('white'));

// 배경색을 위한 새로운 Paint 객체 생성
const bgPaint = Skia.Paint();
bgPaint.setStyle(PaintStyle.Fill);
bgPaint.setColor(Skia.Color('green'));

const familyName = Platform.select({ ios: "Arial", default: "serif" });

// 시스템 폰트 매니저 가져오기
const fontMgr = Skia.FontMgr.System();

// 폰트 매칭
const typeface = fontMgr.matchFamilyStyle(familyName, FontStyle.Normal);
if (!typeface) {
    throw new Error('폰트를 찾을 수 없습니다.');
}
// Define a font for the speed text
const speedFont = Skia.Font(typeface, 44);

// Utility functions to stringify tensors and models
function tensorToString(tensor: Tensor): string {
  return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`
}

function modelToString(model: TensorflowModel): string {
  return (
    `TFLite Model (${model.delegate}):\n` +
    `- Inputs: ${model.inputs.map(tensorToString).join('')}\n` +
    `- Outputs: ${model.outputs.map(tensorToString).join('')}`
  );
}

interface TrackedObject {
  x: number;
  y: number;
  w: number;  
  h: number;  
  timestamp: number;
  speed: number;
}

// ModelType 인터페이스 정의
interface ModelType {
  id: string;
  name: string;
  path: any;
  inputSize: { width: number; height: number };
}

// 인터페이스 추가
interface DetectedPerson {
  xm: number;
  ym: number;
  wm: number;
  hm: number;
  speed: number;
}

// route 파라미터 타입 정의
type RootStackParamList = {
  Camera: { selectedModel: ModelType };
  SpeedCamera: { selectedModel: ModelType };
};

type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

// 상수 추가
const REAL_HEIGHT = 1.7;  // 평균 키 (meters)
const IPHONE_12_WIDTH = 1170;  // 아이폰 12 가로 해상도
const HORIZONTAL_FOV = 65;  // 수평화각

function SpeedCameraScreen(): JSX.Element {
  // 1. Navigation & Route hooks
  const route = useRoute<CameraScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const selectedModel = route.params.selectedModel;
  

  // 2. Permission & Device hooks
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  // 3. State hooks
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomFactor, setZoomFactor] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMatchModalVisible, setIsMatchModalVisible] = useState<boolean>(false);

  // 4. Ref hooks
  const slideAnim = useRef(new Animated.Value(-screenHeight)).current;
  const trackedObjectsRef = useRef<{ [key: string]: TrackedObject }>({});

  // 5. Shared Value hooks
  //const showSpeed = useSharedValue(false);
  const people = useSharedValue<DetectedPerson[]>([]);
  const previousPositions = useSharedValue<{ [key: string]: { x: number; y: number; height: number; timestamp: number } }>({});
  const calculateZoom = (value: number) => {
    return Math.exp(Math.log(device?.maxZoom || 10) * value);
  };

  // 6. Model & Plugin hooks
  const delegate = Platform.OS === 'ios' ? 'core-ml' : undefined;
  const model = useTensorflowModel(selectedModel.path, delegate);
  const { resize } = useResizePlugin();
  const actualModel = model?.state === 'loaded' ? model.model : undefined;

  //7. modal hooks
  const [showMatchSelection, setShowMatchSelection] = useState(false);


  // Worklet functions
  const onPeopleDetected = Worklets.createRunOnJS((detectedPeople: DetectedPerson[]) => {
    people.value = detectedPeople;
  });

  // Frame processor
  const frameProcessor = useSkiaFrameProcessor((frame) => {
    'worklet';
    frame.render();
    if (actualModel == null) {
      return;
    }

    // 여기에 계산 함수들을 worklet 내부로 이동
    const calculateFocalLength = () => {
      'worklet';
      const halfWidth = IPHONE_12_WIDTH / 2;
      return halfWidth / Math.tan((HORIZONTAL_FOV / 2) * (Math.PI / 180));
    };

    const calculateRealDistance = (pixelHeight: number) => {
      'worklet';
      const focalLength = calculateFocalLength();
      return (REAL_HEIGHT * focalLength) / pixelHeight;
    };

    const calculateSpeed = (prevDistance: number, currentDistance: number, timeDiff: number) => {
      'worklet';
      const distanceDiff = Math.abs(currentDistance - prevDistance);
      const timeInSeconds = timeDiff / 1000;
      
      // 시간 차이가 너무 작거나 큰 경우 무시
      if (timeInSeconds < 0.016 || timeInSeconds > 1.0) {  // 60fps 기준
        return 0;
      }
      
      const speedMPS = distanceDiff / timeInSeconds;
      const speedKPH = speedMPS * 3.6;
      
      // 축구 선수의 현실적인 속도 범위로 제한 (약 0-40km/h)
      if (speedKPH > 40 || speedKPH < 0) {
        return 0;
      }
      
      // 급격한 속도 변화 방지
      return Math.round(speedKPH * 10) / 10;  // 소수점 첫째자리까지만 표시
    };

    // 프레임 처리 주기 증가 (30fps -> 60fps)
    runAtTargetFps(60, () => {
      const resized = resize(frame, {
        scale: {
          width: selectedModel.inputSize.width,
          height: selectedModel.inputSize.height,
        },
        pixelFormat: 'rgb',
        dataType: 'uint8',
      });

      const result = actualModel.runSync([resized]);
      const detection_boxes = result[0];
      const detection_classes = result[1];
      const detection_scores = result[2];
      const num_detections = result[3];

      const currentTimestamp = Date.now();
      const detectedPeople = [];
      const numDetections = detection_boxes.length;

      for (let i = 0; i < numDetections; i += 4) {
        const confidence = detection_scores[i / 4];
        const classId = detection_classes[i / 4];

        if (confidence > 0.6 && classId === 0) {
          const objectId = `${classId}_${i / 4}`;

          const x = Number(detection_boxes[i]);
          const y = Number(detection_boxes[i + 1]);
          const w = Number(detection_boxes[i + 2]);
          const h = Number(detection_boxes[i + 3]);

          const xm = y * frame.width;
          const ym = x * frame.height;
          const wm = (h - y) * frame.width;
          const hm = (w - x) * frame.height;

          // 실제 거리 계산
          const currentDistance = calculateRealDistance(hm);
          let speed = 0;

          const prevPosition = previousPositions.value[objectId];
          
          if (prevPosition) {
            // 위치가 너무 급격하게 변하는 경우 무시
            const positionDiff = Math.abs(hm - prevPosition.height);
            if (positionDiff < frame.height * 0.5) {  // 화면 높이의 50% 이상 차이나면 무시
              const prevDistance = calculateRealDistance(prevPosition.height);
              const timeDiff = currentTimestamp - prevPosition.timestamp;
              speed = calculateSpeed(prevDistance, currentDistance, timeDiff);
            }
          }

          // 현재 위치와 높이 저장
          previousPositions.value = {
            ...previousPositions.value,
            [objectId]: {
              x: xm,
              y: ym,
              height: hm,  // 픽셀 높이도 저장
              timestamp: currentTimestamp
            }
          };

          // 바운딩 박스 그리기
          const rect = Skia.XYWHRect(xm, ym, wm, hm);
          frame.drawRect(rect, boxPaint);

          // 속도 텍스트 그리기
            const speedText = `${speed.toFixed(1)} km/h`;
            const textX = xm;
            const textY = ym - 10;

            // 텍스트 배경을 위한 사각형 그리기
            const textBounds = speedFont.getTextWidth(speedText);
            const padding = 5;
            const bgRect = Skia.XYWHRect(
              textX - padding,
              textY - speedFont.getSize(),
              textBounds + 20,
              speedFont.getSize() + 20
            );
            frame.drawRect(bgRect, bgPaint);
            frame.drawText(speedText, textX, textY, textPaint, speedFont);
          

          detectedPeople.push({
            xm,
            ym,
            wm,
            hm,
            speed
          });
        }
      }

      people.value = detectedPeople;
      onPeopleDetected(detectedPeople);
    });
  }, [actualModel, boxPaint, textPaint, bgPaint, speedFont]);

  // Effects
  useEffect(() => {
    const initialize = async () => {
      if (!hasPermission) {
        await requestPermission();
      }
      setTimeout(() => {
        setIsInitializing(false);
      }, 1000);
    };
    initialize();
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (model?.state === 'loaded') {
      setIsLoading(false);
    }
  }, [model?.state]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isMenuOpen ? 0 : -screenHeight,
      useNativeDriver: true,
      tension: 65,
      friction: 9
    }).start();
  }, [isMenuOpen, slideAnim]);

  // Loading check
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {hasPermission && device != null ? (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            pixelFormat="rgb"
            zoom={calculateZoom(zoomFactor)}
          />
          
          {isMenuOpen && (
            <Animated.View 
              style={[
                styles.menuOverlay,
                {
                  transform: [
                    {translateY: slideAnim},
                    {rotate: '90deg'}
                  ]
                }
              ]}>
              <View style={styles.menuItemsContainer}>
                <TouchableOpacity 
                  style={[styles.menuItem, {backgroundColor: 'rgba(0,0,0,0.7)'}]}
                  onPress={() => {
                    console.log('선수 속도 선택됨');
                    navigation.navigate('Camera', { 
                      selectedModel: selectedModel 
                    });
                  }}>
                  <Text style={[styles.menuText, {color: 'white'}]}>선수 속도</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => {
                    setShowMatchSelection(true);
                  }}>
                  <Text style={styles.menuText}>경기 조회</Text>
                </TouchableOpacity>

                <MatchSelectionOverlay
                  isVisible={showMatchSelection}
                  onClose={() => setShowMatchSelection(false)}
                />
              </View>
            </Animated.View>
          )}
          
          <View style={styles.hamburgerContainer}>
            <HamburgerMenu onPress={() => {
              setIsMenuOpen(!isMenuOpen);
            }} />
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={zoomFactor}
            onValueChange={setZoomFactor}
          />
        </>
      ) : (
        <Text>카메라 접근 권한이 없습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slider: {
    position: 'absolute',
    bottom: 50,
    width: '80%',
    left: '10%',
  },
  hamburgerContainer: {
    position: 'absolute',
    top: "45%",
    left: "85%",
    right: 0,
    transform: [{rotate: '-90deg'}],
    zIndex: 3,
  },



  menuOverlay: {
    padding: '55.5%',
    top: '0%',
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 0,
    zIndex: 2,
  },
  menuItem: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    
    padding: 12,
    borderRadius: 8,
    marginVertical: 0,
    width:  90,
    height: 40,
    marginLeft: 97,
    marginTop: 10,
    bottom: 0,
    transform: [{rotate: '90deg'}],
  },
  menuText: {
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
    fontWeight: '500',
  },
  menuItemsContainer: {
    justifyContent: 'center',
    width: '50%',
    top: '-14.5%',
    transform: [{rotate: '-90deg'}],
    gap: 100,
  },








  matchItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
  matchText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
    fontSize: 16,
  },


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: '-20%',
   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    //backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
  },
});

export default SpeedCameraScreen;

