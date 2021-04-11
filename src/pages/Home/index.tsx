import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import api from '../../services/api';

interface UF {
  id: number;
  sigla: string;
}

interface City {
  id: number;
  nome: string;
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [ufs, setUFS] = useState<UF[]>([]);
  const [selectUF, setSelectedUF] = useState<UF>({} as UF);
  const [cidades, setCidades] = useState<City[]>([]);
  const [cidade, setCidade] = useState<City>({} as City);

  useEffect(() => {
    async function loadUFs() {
      const response = await api.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      setUFS(response.data);
    }
    loadUFs()
  }, [])

  useEffect(() => {
    async function loadCitys() {
      const response = await api.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectUF.id}/municipios`);
      setCidades(response.data);
      setCidade({} as City);
    }
    if (selectUF && selectUF.id > 0) loadCitys();
  }, [selectUF])

  function handleNavigateToPoints() {
    if (cidade.id && selectUF.id) {
      const params = {
        city: cidade.nome,
        uf: selectUF.sigla
      }
      navigation.navigate('Points', params);
    }
  }

  function handleSelectUf(uf: UF) {
    setSelectedUF(uf);
  }

  function handleSelectCity(city: City) {
    setCidade(city)
  }

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect 
          style={pickerSelectStyles}
          onValueChange={handleSelectUf}
          items={ufs.map(uf => (
            { label: uf.sigla, value: uf, key: uf.id }
          ))}
          placeholder={{
            label: 'Informe a UF'
          }}
        />
        <RNPickerSelect 
          style={pickerSelectStyles}
          onValueChange={handleSelectCity}
          items={cidades.map(cidade => (
            { label: cidade.nome, value: cidade, key: cidade.id }
          ))}
          placeholder={{
            label: 'Informe a cidade'
          }}
        />
        <RectButton 
          style={styles.button} 
          onPress={handleNavigateToPoints} 
        >
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#FFF" size={24} />
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

export default Home;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f0f0f5'
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#34CB79',
    borderRadius: 10,
    color: '#322153',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#34CB79',
    borderRadius: 10,
    color: '#322153',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 5,
  },
});