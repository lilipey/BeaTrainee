import colors from '@/theme';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: object;
  textStyle?: object;
  backgroundColor?: string;
}

export default function CustomButton({ title, onPress, buttonStyle, textStyle, backgroundColor }: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle, 
        { backgroundColor: backgroundColor || colors.blue },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});