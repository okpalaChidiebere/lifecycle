import React from 'react'
import { Text, ScrollView } from 'react-native'

export default function StateList ({ appStateVisible}) {
  return (
    <ScrollView>
        {appStateVisible.map((state, index) => <Text key={index}>{state}</Text>)}
    </ScrollView>
  )
}