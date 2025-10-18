import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../constants/theme';

interface WavyHeaderProps {
    children: React.ReactNode;
}

const WavyHeader: React.FC<WavyHeaderProps> = ({ children }) => {
    const { width } = useWindowDimensions();
    const height = 130;

    return (
        <View style={{ height }}>
            <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
                <Defs>
                    {/* New, darker gradient for a richer look */}
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#4c0a2a" />
                        <Stop offset="100%" stopColor="#2c003e" />
                    </LinearGradient>
                </Defs>
                <Path
                    d={`M0,0 L0,${height * 0.7} C${width * 0.25},${height * 1.1} ${width * 0.75},${height * 0.3} ${width},${height * 0.7} L${width},0 Z`}
                    fill="url(#grad)"
                />
            </Svg>
            <View style={styles.contentContainer}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
});

export default WavyHeader;

