import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../constants/theme';

interface CustomInputProps extends TextInputProps {}

const CustomInput: React.FC<CustomInputProps> = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={theme.colors.muted}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    // Changed to a semi-transparent white background
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: theme.borderRadius.m,
    // Changed text color to be dark for contrast
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: theme.spacing.m,
    // Kept the subtle border for definition
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default CustomInput;

