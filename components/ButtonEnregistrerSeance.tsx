import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import colors from '@/theme';

interface SaveSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
}

const SaveSessionModal: React.FC<SaveSessionModalProps> = ({ visible, onClose, onSave }) => {
  const [sessionTitle, setSessionTitle] = useState('');
    
  const handleSave = () => {
    if (!sessionTitle.trim()) {
      alert('Veuillez entrer un titre pour la séance.');
      return;
    }
    onSave(sessionTitle);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enregistrer la séance</Text>
          <TextInput
            style={styles.input}
            placeholder="Titre de la séance"
            value={sessionTitle}
            onChangeText={setSessionTitle}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <CustomButton title="Annuler" onPress={onClose} backgroundColor={colors.red} />
          <CustomButton title="Enregistrer" onPress={handleSave} />
          </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 5,
  },
});

export default SaveSessionModal;