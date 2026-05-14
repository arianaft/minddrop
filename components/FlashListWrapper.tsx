import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

export default function FlashListWrapper<T>(props: FlatListProps<T>) {
  return <FlatList {...props} />;
}