import * as React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Text,
} from 'react-native';
import {DemoTitle, DemoButton} from './src/index';

import * as ImagePicker from './src/helpers';

export default function App() {
  const [response, setResponse] = React.useState<any>(null);

  const onButtonPress = React.useCallback((type, options) => {
    if (type === 'capture') {
      ImagePicker.launchCamera(options, setResponse);
    } else {
      ImagePicker.launchImageLibrary(options, setResponse);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {console.log(response)}
      <DemoTitle>🥑 avocad-o-meter - v1.0.0</DemoTitle>
      <ScrollView>
        {response?.assets ? (
          response?.assets.map(({uri}) => (
            <View key={uri} style={styles.image}>
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                style={{width: 400, height: 500}}
                source={{uri: uri}}
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
    marginVertical: 10,
  },
  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
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
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
  {
    title: 'Choose From Library',
    type: 'library',
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
    },
  },
  // {
  //   title: 'Take Video',
  //   type: 'capture',
  //   options: {
  //     saveToPhotos: true,
  //     mediaType: 'video',
  //   },
  // },
  // {
  //   title: 'Select Video',
  //   type: 'library',
  //   options: {
  //     selectionLimit: 0,
  //     mediaType: 'video',
  //   },
  // },
  // {
  //   title: `Select Image or Video\n(mixed)`,
  //   type: 'library',
  //   options: {
  //     selectionLimit: 0,
  //     mediaType: 'mixed',
  //   },
  // },
];
