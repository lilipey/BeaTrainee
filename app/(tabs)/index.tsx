import { Image, StyleSheet, Platform, Text, KeyboardAvoidingView, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button } from 'react-native-elements';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import Timer from '@/components/TimerScreen';
import { SetStateAction, useEffect, useState } from 'react';
import InputField from '@/components/Input';
import SessionPickerModal from '@/components/ModalSetSeance';
import CustomButton from '@/components/CustomButton';
import colors from '@/theme';


export default function HomeScreen() {
  const [durationRepet, setDurationRepet] = useState("");
  const [repetition, setRepetition] = useState("");
  const [series, setSeries] = useState("");
  const [durationSeries, setDurationSeries] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelectSession = (session: { durationRepet: string; repetition: string; series: string; durationSeries: string }) => {
    setDurationRepet(session.durationRepet);
    setRepetition(session.repetition);
    setSeries(session.series);
    setDurationSeries(session.durationSeries);
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: '#fff', }}>

          <ThemedView style={styles.titleContainer}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#0a7ea4', backgroundColor: '#fff' }}>
              Bienvenue sur Beatrainee
            </Text>
            <InputField label="Nombre de répétiton(s)" placeholder="nombre répétition" onChange={(text => setRepetition(text))} value={repetition} />
            <Timer duration={durationRepet} onChange={(text) => setDurationRepet(text)} titleModal="d'une répétition" />
            <InputField label="Nombre de série(s)" placeholder="nombre série" onChange={(text => setSeries(text))} value={series}
            />
            <Timer duration={durationSeries} onChange={(text) => setDurationSeries(text)} titleModal="d'une pause" />

            <CustomButton
              title="Commencer une séance"
              backgroundColor={colors.pink}
              onPress={() => {
                if (!durationRepet || !repetition || !series || !durationSeries) {
                  alert('Veuillez remplir tous les champs.');
                  return;
                } else {
                  router.push({
                    pathname: '/explore', // Chemin de la page cible
                    params: {
                      durationRepet,
                      repetition,
                      series,
                      durationSeries,
                    },
                  });
                }
              }}
            />
            <View>
              <CustomButton title="Choisir une séance" onPress={() => setIsModalVisible(true)} />
              <SessionPickerModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSelectSession={handleSelectSession}
              />
            </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1, backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 30,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
