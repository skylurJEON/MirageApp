// import { Image, ImageURISource } from 'react-native';

// interface HeightmapData {
//   heightData: number[];
//   width: number;
//   height: number;
// }

// export const convertImageToHeightmap = async (imageSource: ImageURISource): Promise<HeightmapData> => {
//   try {
//     // 이미지 크기 가져오기 - resolveAssetSource 사용
//     const image = Image.resolveAssetSource(imageSource);
//     const width = image.width;
//     const height = image.height;

//     // 높이맵 데이터 생성
//     const heightData: number[] = [];
//     const totalPixels = width * height;
    
//     // 임시로 단순한 패턴의 높이 데이터 생성
//     for (let i = 0; i < totalPixels; i++) {
//       const x = i % width;
//       const y = Math.floor(i / width);
//       const height = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 + 0.5;
//       heightData.push(height);
//     }

//     return {
//       heightData,
//       width,
//       height
//     };
//   } catch (error) {
//     console.error('Error converting image to heightmap:', error);
//     throw error;
//   }
// };