import React from 'react';
import { ScrollView } from 'react-native';
import { AstranovaAgent } from '../../src/components/astranova/AstranovaAgent';

export default function AstranovaScreen() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <AstranovaAgent />
    </ScrollView>
  );
}
