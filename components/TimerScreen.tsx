import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Keyboard } from "react-native";
import { TimerPickerModal } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

interface TimePickerFieldProps {
  onChange: (text: string) => void;
  titleModal?: string;
  duration: string
}

export default function TimerField(props: TimePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formatTime = ({ minutes, seconds }: { minutes?: number; seconds?: number }) => {
    const parts = [];
    if (minutes !== undefined) parts.push(minutes.toString().padStart(2, "0"));
    if (seconds !== undefined) parts.push(seconds.toString().padStart(2, "0"));
    return parts.join(":");
  };
  const formatToNumberTime = (duration: string) => {
    const [minutes, seconds] = duration.split(":").map((part) => Number(part.trim()));
    console.log(minutes)
    return { minutes, seconds };
  }
  formatToNumberTime(props.duration)
  return (
    <>
      <View style={styles.wrapper}>
        <Text style={styles.label}>Durée {props.titleModal}</Text>
        <Pressable
          onPress={() => {
            setShowPicker(true);
            Keyboard.dismiss();
          }}
          style={styles.displayText}
        >
          <Text style={styles.displayTextValue}>
            {props.duration || "00:00"}
          </Text>
        </Pressable>
        <TimerPickerModal
          initialValue={formatToNumberTime(props.duration)}
          visible={showPicker}
          setIsVisible={setShowPicker}
          onConfirm={(pickedDuration) => {
            setShowPicker(false);
            props.onChange(formatTime(pickedDuration));
          }}
          hideHours
          repeatMinuteNumbersNTimes={1}
          repeatSecondNumbersNTimes={1}
          disableInfiniteScroll={true}
          modalTitle={`Durée ${props.titleModal}`}
          onCancel={() => setShowPicker(false)}
          closeOnOverlayPress
          Audio={Audio}
          LinearGradient={LinearGradient}
          Haptics={Haptics}
          styles={{ theme: "dark" }}
          modalProps={{ overlayOpacity: 0.2 }}
          confirmButtonText="Confirmer"
          cancelButtonText="Annuler"
          
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0a7ea4", // Couleur du label
    marginBottom: 8,
  },
  displayText: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8, // Bordures arrondies
    backgroundColor: "#f9f9f9", // Fond clair
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Ombre pour Android
  },
  displayTextValue: {
    fontSize: 16,
    color: "#333", // Couleur du texte
  },
});