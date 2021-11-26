import * as React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import {DemoTitle, DemoButton} from './src/index';
import axios from 'axios';

import * as ImagePicker from './src/helpers';

export default function App() {
  const [response, setResponse] = React.useState<any>(null);
  const [prediction, setPrediction] = React.useState('');
  console.log(response);

  React.useEffect(() => {
    if (response && response.assets && response.assets[0]) {
      const fd = new FormData();
      const photo = response?.assets[0];

      fd.append('upload', {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      });
      axios
        .post('https://9d33-186-77-204-28.ngrok.io/predict/fruit', fd)
        .then(res => setPrediction(`Your image contains a ${res.data}.`));
    }
  }, [response]);
  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
    setPrediction('');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DemoTitle>🥑 avocad-o-meter - v1.0.0</DemoTitle>
      <ScrollView>
        {response?.assets ? (
          response?.assets.map(({uri}) => (
            <View key={uri} style={styles.imageContainer}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={styles.image}
                source={{uri}}
              />
            </View>
          ))
        ) : (
          <Text style={styles.title}>Upload a photo of a fruit</Text>
        )}
        <View style={styles.buttonContainer}>
          {actions.map(({title, type, options}) => {
            return (
              <DemoButton
                key={title}
                onPress={() => onButtonPress(type, options)}>
                {title}
              </DemoButton>
            );
          })}
        </View>
        <Text style={styles.prediction}>{prediction}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  buttonContainer: {
    marginVertical: 25,
  },
  imageContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 500,
    borderRadius: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  prediction: {
    marginVertical: 15,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
  {
    title: 'Take Photo',
    type: 'capture',
    options: {
      quality: 1,
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
  // {
  //   title: 'Choose From Library',
  //   type: 'library',
  //   options: {
  //     quality: 1,
  //     selectionLimit: 1,
  //     mediaType: 'photo',
  //     includeBase64: false,
  //   },
  // },
];
