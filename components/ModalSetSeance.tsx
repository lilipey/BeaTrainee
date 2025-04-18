import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import colors from '@/theme';

// Définir le type pour une séance
interface Session {
  title: string;
  durationRepet: string;
  repetition: string;
  series: string;
  durationSeries: string;
}

interface SessionPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSession: (session: Session) => void;
}

const fetchSessions = async (): Promise<Session[]> => {
  try {
    const sessionsJSON = await AsyncStorage.getItem('sessions');
    if (sessionsJSON !== null) {
      const sessions: Session[] = JSON.parse(sessionsJSON);
      return sessions;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des séances :', error);
    return [];
  }
};

const SessionPickerModal: React.FC<SessionPickerModalProps> = ({ visible, onClose, onSelectSession }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (visible) {
      const loadSessions = async () => {
        const fetchedSessions = await fetchSessions();
        setSessions(fetchedSessions);
      };
      loadSessions();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sélectionnez une séance</Text>
          <FlatList
            data={sessions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.sessionItem}
                onPress={() => onSelectSession(item)}
              >
                <Text style={styles.sessionTitle}>{item.title}</Text>
                <Text style={styles.sessionDetails}>
                  Répétitions : {item.repetition}, Séries : {item.series}, Durée répétition : {item.durationRepet}, Pause : {item.durationSeries}
                </Text>
              </TouchableOpacity>
            )}
          />
          <CustomButton title={'Fermer'} onPress={onClose} backgroundColor={colors.red}></CustomButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15, // Bordures arrondies
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Ombre pour Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a7ea4', // Couleur moderne
    marginBottom: 15,
    textAlign: 'center',
  },
  sessionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9', // Fond clair pour chaque item
    marginBottom: 10,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sessionDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f44336', // Rouge pour le bouton "Fermer"
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SessionPickerModal;