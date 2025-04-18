import { View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";

interface InputFieldProps {
  label: string;
  placeholder: string;
  onChange: (text: string) => void;
  value: string;
}


export default function InputField(props: InputFieldProps) {
  
  return (
    <View style={styles.container}>
      <Input
        placeholder={props.placeholder}
        errorStyle={{ margin: 0, height: 0 }}
        label={props.label}
        labelStyle={styles.label}
        placeholderTextColor={"#888"} 
        onChangeText={props.onChange}
        value = {props.value}
        inputStyle={styles.input} 
        containerStyle={styles.inputContainer} 
        inputContainerStyle={styles.inputInnerContainer} 
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
    
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0a7ea4", // Couleur du label
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: "#000", // Couleur du texte saisi
    paddingHorizontal: 10,
  },
  inputContainer: {
    borderBottomWidth: 0, // Supprimer la ligne par défaut
    paddingVertical: 5,
    paddingHorizontal: 0,
    
  },
  inputInnerContainer: {
    borderWidth: 1, // Ajouter une bordure
    borderColor: "#ccc", // Couleur de la bordure
    borderRadius: 8, // Bordures arrondies
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f9f9f9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4, // Fond clair pour le champ
  },
});