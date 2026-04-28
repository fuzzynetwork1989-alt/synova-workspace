import React from 'react';
import { ScrollView } from 'react-native';
import { SupanovaAgent } from '../../src/components/supanova/SupanovaAgent';

export default function SupanovaScreen() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <SupanovaAgent />
    </ScrollView>
  );
}
