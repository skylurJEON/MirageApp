// import React from 'react';
// import {
//   ViroARScene,
//   ViroMaterials,
//   ViroNode,
//   ViroGeometry,
//   ViroARSceneNavigator,
// } from '@reactvision/react-viro';
// import { StyleSheet } from 'react-native';

// interface HeightmapProps {
//   heightData: number[];
//   width: number;
//   height: number;
//   imageUri: any;
// }

// const HeightmapARScene: React.FC<HeightmapProps> = ({ heightData, width, height, imageUri }) => {
//   // 지형 메시 생성
//   const createTerrainMesh = () => {
//     const vertices: [number, number, number][] = [];
//     const triangleIndices: [number, number, number][] = [];
//     const texcoords: [number, number][] = [];
//     const normals: [number, number, number][] = [];
//     const scale = 0.1; // 크기 조절 계수
    
//     // 버텍스와 UV 좌표 생성
//     for (let z = 0; z < height; z++) {
//       for (let x = 0; x < width; x++) {
//         const y = heightData[z * width + x] * scale;
//         vertices.push([
//           x * scale - (width * scale) / 2,
//           y,
//           z * scale - (height * scale) / 2
//         ]);
//         texcoords.push([x / width, z / height]);
//         normals.push([0, 1, 0]); // 기본 법선 벡터 (위쪽 방향)
//       }
//     }
    
//     // 삼각형 인덱스 생성
//     for (let z = 0; z < height - 1; z++) {
//       for (let x = 0; x < width - 1; x++) {
//         const topLeft = z * width + x;
//         const topRight = topLeft + 1;
//         const bottomLeft = (z + 1) * width + x;
//         const bottomRight = bottomLeft + 1;
        
//         triangleIndices.push([topLeft, bottomLeft, topRight]);
//         triangleIndices.push([topRight, bottomLeft, bottomRight]);
//       }
//     }
    
//     return { vertices, triangleIndices, texcoords, normals };
//   };

//   const terrainMesh = createTerrainMesh();

//   // 재질 정의
//   ViroMaterials.createMaterials({
//     terrainMaterial: {
//       diffuseTexture: imageUri,
//       lightingModel: "Lambert",
//     },
//   });

//   return (
//     <ViroARScene>
//       <ViroNode position={[0, -1, -2]}>
//         <ViroGeometry
//           position={[0, 0, 0]}
//           scale={[1.0, 1.0, 1.0]}
//           vertices={terrainMesh.vertices}
//           normals={terrainMesh.normals}
//           texcoords={terrainMesh.texcoords}
//           triangleIndices={terrainMesh.triangleIndices}
//           materials={["terrainMaterial"]}
//         />
//       </ViroNode>
//     </ViroARScene>
//   );
// };

// // 메인 컴포넌트
// export const HeightmapARNavigator: React.FC<HeightmapProps> = (props) => {
//   return (
//     <ViroARSceneNavigator
//       autofocus={true}
//       initialScene={{
//         scene: () => <HeightmapARScene {...props} />,
//       }}
//       style={styles.flex}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   flex: {
//     flex: 1,
//   },
// });