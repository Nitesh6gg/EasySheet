import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ActivityIndicator } from 'react-native';

// ========== DOT LOADER ==========
type DotLoaderProps = {
  size?: number;
  color?: string;
  dotCount?: number;
  spacing?: number;
  customStyle?: object;
};

const DotLoader = ({
                     size = 8,
                     color = '#6200ee',
                     dotCount = 3,
                     spacing = 4,
                     customStyle = {}
                   }: DotLoaderProps) => {
  const animations = useRef(
    Array(dotCount).fill(0).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animateDots = () => {
      const sequence = animations.map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * 120),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay((dotCount - index - 1) * 120),
        ]);
      });

      Animated.stagger(100, sequence).start(animateDots);
    };

    animateDots();
    return () => animations.forEach(anim => anim.stopAnimation());
  }, []);

  return (
    <View style={[styles.dotLoaderContainer, customStyle]}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              marginRight: index === dotCount - 1 ? 0 : spacing,
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
              ],
              opacity: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};


export {DotLoader };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  loaderSection: {
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#555',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularLoader: {
    borderRadius: 100,
    borderStyle: 'solid',
  },
  linearLoaderContainer: {
    overflow: 'hidden',
    borderRadius: 4,
  },
  linearLoaderBar: {
    height: '100%',
    width: '100%',
  },
  dotLoaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    backgroundColor: '#6200ee',
  },
  spacer: {
    height: 20,
  },
});