import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import LoadingScreen from '../components/LoadingScreen';
import { useTensorflowModel } from 'react-native-fast-tflite';

type RootStackParamList = {
  Main: undefined;
  Camera: { selectedModel: ModelType };
  ModelSelection: undefined;
};

type ModelSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ModelSelection'
>;

type ModelType = {
  id: string;
  name: string;
  path: any;
  inputSize: { width: number; height: number };
  description: string;
};

const models: ModelType[] = [
  { 
    id: 'ssd_mobilenet_v1', 
    name: 'SSD MobileNet V1', 
    path: require('../assets/ssd_movilenet_v1.tflite'),
    inputSize: { width: 300, height: 300 },
    description: '빠른 속도, 실시간 감지에 최적화된 경량 모델',
  },
  { 
    id: 'efficientdet', 
    name: 'EfficientDet', 
    path: require('../assets/efficientdet.tflite'),
    inputSize: { width: 320, height: 320 },
    description: '높은 정확도, 복잡한 장면 감지에 적합한 모델',
  },
];

const ModelSelectionScreen: React.FC = () => {
  const navigation = useNavigation<ModelSelectionScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null);

  const handleModelSelect = (model: ModelType) => {
    setIsLoading(true);
    setSelectedModel(model);
    
    // 1초 후 카메라 화면으로 전환
    setTimeout(() => {
      navigation.replace('Camera', { selectedModel: model });
    }, 1000);
  };

  if (isLoading && selectedModel) {
    return (
      <LoadingScreen 
        message="가로 화면으로 이용해주세요"
        subMessage={`${selectedModel.name} 모델을 준비중입니다`}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>모델 선택</Text>
        <View style={styles.modelsContainer}>
          {models.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.modelItemContainer} 
              onPress={() => handleModelSelect(item)}
            >
              <View style={styles.modelItem}>
                <Text style={styles.modelName}>{item.name}</Text>
                <Text style={styles.modelDescription}>{item.description}</Text>
                <View style={styles.modelDetails}>
                  <Text style={styles.modelSize}>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    width: '100%',
    height: '71.4%',
    padding: '10%',
    backgroundColor: '#e3e3e3',
    borderRadius: 8,
    alignItems: 'center',
    //marginTop: '0%',
    marginLeft: '-15%',
    marginBottom: '2.5%',
    shadowColor: '#000',
    shadowOffset: {
      width: 8,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 5,
  },

  title: {
    fontSize: 32,
    fontWeight: '200',
    color: '#333333',
    marginLeft: '15%',
  },

  modelsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },

  modelItemContainer: {
    marginBottom: 40,

    marginLeft: '15.3%',
    //borderRadius: 16,
    backgroundColor: '#f0f0f0',
    width: '109%',
    borderTopLeftRadius: 16,      // 왼쪽 상단
    borderBottomLeftRadius: 16,   // 왼쪽 하단
    borderTopRightRadius: 0,      // 오른쪽 상단
    borderBottomRightRadius: 0,   // 오른쪽 하단
  },

  modelItem: {
    padding: 0,
    paddingVertical: '5%',
    width: '100%',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginRight: '0%',
  },
  modelName: {
    fontSize: 22,
    fontWeight: '500',
    color: '#444444',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'left',
    marginLeft: '5%',
  },
  modelDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  modelSize: {
    fontSize: 14,
    color: '#999999',
  },
  modelDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
    lineHeight: 22,
    textAlign: 'left',
    marginLeft: '5%',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },
});

export default ModelSelectionScreen;
