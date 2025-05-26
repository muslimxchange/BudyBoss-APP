import React from 'react';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeButton = () => {
  const navigation = useNavigation();

  return (
    <View style={{ margin: 20 }}>
      <Button title="Go to Hello World" onPress={() => navigation.navigate('HelloWorld')} />
    </View>
  );
};

export default HomeButton;
