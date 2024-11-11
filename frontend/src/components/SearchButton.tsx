import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SearchButtonProps {
  onSearch?: (text: string) => void;
  placeholder?: string;
  containerStyle?: object;
  inputStyle?: object;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onSearch,
  placeholder = "검색어를 입력하세요...",
  containerStyle,
  inputStyle,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const animatedWidth = useRef(new Animated.Value(40)).current;
  const inputRef = useRef<TextInput>(null);

  const toggleSearch = () => {
    if (searchText) return; // 텍스트가 있으면 축소되지 않음
    
    const toValue = isExpanded ? 40 : 200;
    setIsExpanded(!isExpanded);
    
    Animated.spring(animatedWidth, {
      toValue,
      useNativeDriver: false,
      friction: 10,
      tension: 5
    }).start(() => {
      if (!isExpanded) {
        inputRef.current?.focus(); // 확장될 때 키보드 표시
      }
    });
  };

  const handleChangeText = (text: string) => {
    setSearchText(text);
    if (onSearch) onSearch(text);
    
    // 텍스트가 있으면 확장 상태 유지
    if (text && !isExpanded) {
      setIsExpanded(true);
      Animated.spring(animatedWidth, {
        toValue: 200,
        useNativeDriver: false,
        friction: 10,
        tension: 55
      }).start();
    }
  };

  const shrinkSearch = () => {
    if (!searchText) {  // 텍스트가 없을 때만 축소
      setIsExpanded(false);
      Animated.spring(animatedWidth, {
        toValue: 40,
        useNativeDriver: false,
        friction: 10,
        tension: 55
      }).start();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    shrinkSearch();
  };

  const handleSubmitEditing = () => {
    if (!searchText) {
      inputRef.current?.blur();  // 키보드 닫기
      shrinkSearch();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, containerStyle]}>
        <Animated.View style={{ width: animatedWidth }}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              (isFocused || isExpanded) && styles.inputFocused,
              inputStyle,
              { width: '100%' }
            ]}
            value={searchText}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor="#666"
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="search"
          />
        </Animated.View>
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={toggleSearch}
        >
          <Svg width={24} height={24} viewBox="0 0 512 512">
            <Path
              d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z"
              fill="none"
              stroke="#fff"
              strokeMiterlimit={10}
              strokeWidth={32}
            />
            <Path
              d="M338.29 338.29L448 448"
              fill="none"
              stroke="#fff"
              strokeLinecap="round"
              strokeMiterlimit={10}
              strokeWidth={32}
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 40,
    paddingLeft: 30,
    fontSize: 15,
    color: '#fff',
    backgroundColor: '#191A1E',
    borderRadius: 25,
    width: 40,
    paddingRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderLeftWidth: 1,
  },
  inputFocused: {
    width: 200,
    paddingLeft: 40,
    backgroundColor: '#161719',
    shadowColor: '#000',
    shadowOffset: {
      width: -3,
      height: -3,
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    borderTopWidth: 1,
    borderLeftColor: 'rgba(0, 0, 0, 0.2)',
    borderLeftWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
    borderRightWidth: 1,
  },
  iconContainer: {
    position: 'absolute',
    left: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
  },
});

export default SearchButton;