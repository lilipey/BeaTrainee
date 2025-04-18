import { useLocalSearchParams } from 'expo-router/build/hooks';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import React, { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SaveSessionModal from '@/components/ButtonEnregistrerSeance';
import CustomButton from '@/components/CustomButton';
import colors from '@/theme';

export default function ExploreScreen() {
  let { durationRepet, repetition, series, durationSeries } = useLocalSearchParams();

  function convertirEnSecondes(duree: string) {
    if (!duree) return 0;
    const [minutes, secondes] = duree.split(':').map(Number);
    return minutes * 60 + secondes;
  }

  const saveSession = async (sessionData: { title: string; durationRepet: string | string[]; repetition: string | string[]; series: string | string[]; durationSeries: string | string[]; }) => {
    try {
      // Récupérer les séances existantes
      const existingSessions = await AsyncStorage.getItem('sessions');
      const sessions = existingSessions ? JSON.parse(existingSessions) : [];

      // Ajouter la nouvelle séance
      sessions.push(sessionData);

      // Sauvegarder le tableau mis à jour
      await AsyncStorage.setItem('sessions', JSON.stringify(sessions));

      alert('Séance enregistrée avec succès !');
    } catch (e) {
      console.error("Erreur lors de l'enregistrement de la séance :", e);
    }
  };
  useEffect(() => {
    setCurrentRepetition(1);
    setCurrentSeries(1);
    setCurrentDuration(durationRepetInSeconds);
    setTimerKey((prevKey) => prevKey + 1);
    setIsPlaying(false);
  }, [durationRepet, repetition, series, durationSeries]);

  const durationRepetInSeconds = convertirEnSecondes(durationRepet as string);
  const durationSeriesInSeconds = convertirEnSecondes(durationSeries as string);
  const repetitionInt = parseInt(repetition as string);
  const seriesInt = parseInt(series as string);


  const [currentRepetition, setCurrentRepetition] = useState(1);
  const [currentSeries, setCurrentSeries] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(durationRepetInSeconds);
  const [isModalVisible, setIsModalSaveVisible] = useState(false);

  const playBeep = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/beep.mp3')
    );
    await sound.playAsync();
  };
  const handleSaveSession = (sessionTitle: string) => {
    const sessionData = {
      title: sessionTitle,
      durationRepet,
      repetition,
      series,
      durationSeries,
    };
    saveSession(sessionData);
  };
  const handleTimerComplete = async () => {
    if (isPlaying) {
      if (currentRepetition < repetitionInt) {
        if (currentRepetition === Math.ceil(repetitionInt / 2)) {
          Speech.speak(`Moitié des répétitions atteinte`, { rate: 1 });
        }
        setCurrentRepetition(currentRepetition + 1);
        setCurrentDuration(durationRepetInSeconds);
      } else if (currentSeries < seriesInt) {
        Speech.speak(`Série ${currentSeries} terminée. Pause...`, { rate: 1.2 });
        setCurrentSeries(currentSeries + 1);
        setCurrentRepetition(0);
        setCurrentDuration(durationSeriesInSeconds);
      } else {
        Speech.speak("Séance terminée. Bravo !", { rate: 1.2 });
        alert("Séance terminée. Bravo !");
        setIsPlaying(false);
      }
      setTimerKey((prevKey) => prevKey + 1);
    }
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.containerButton}>
          <CustomButton
            title="Retour"
            backgroundColor={colors.lightpink}
            onPress={() => router.back()}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Série</Text>
              <Text style={styles.infoValue}>
                {currentSeries} / {seriesInt}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Répétition</Text>
              <Text style={styles.infoValue}>
                {currentRepetition} / {repetitionInt}
              </Text>
            </View>
          </View>
          <CountdownCircleTimer
            key={timerKey}
            isPlaying={isPlaying}
            duration={currentDuration}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}
            onComplete={() => {
              setTimeout(() => {
                handleTimerComplete();
              }
                , 200);
              return { shouldRepeat: false };
            }}

            onUpdate={(remainingTime) => {
              if (remainingTime <= 3 && remainingTime > 0) {
                Speech.speak(`${remainingTime} `, { rate: 1 });
              }

              if (remainingTime === 0 && currentRepetition < repetitionInt) {
                playBeep();
              }
            }}
          >
            {({ remainingTime }) => <Text style={styles.timerText}>{remainingTime}</Text>}
          </CountdownCircleTimer>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', alignItems: "center" }}>

            <CustomButton
              title="Recommencer"
              backgroundColor={colors.lightblue}
              onPress={() => {
                setCurrentRepetition(1);
                setCurrentSeries(1);
                setCurrentDuration(durationRepetInSeconds);
                setIsPlaying(true);
                setTimerKey(prevKey => prevKey + 1);
              }}

            />
            <CustomButton
              title={isPlaying ? "⏸ Pause" : "▶️ Play"}
              backgroundColor={colors.pink}
              onPress={() => {
                setIsPlaying(!isPlaying);
              }}
              buttonStyle={{
                backgroundColor: '#0a7ea4',
                borderRadius: 10,
                padding: 10,
                margin: 10,
              }}
            />

          </View>
          {!isPlaying && (
            <CustomButton
              title="Enregistrer la séance"
              onPress={() => setIsModalSaveVisible(true)}

            />
          )}
          <SaveSessionModal
            visible={isModalVisible}
            onSave={handleSaveSession}
            onClose={() => setIsModalSaveVisible(false)}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  containerButton: {
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'flex-start',
    // width: '40%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',

    marginBottom: 20,
    paddingHorizontal: 20,
  },
  infoBox: {
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a7ea4',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});