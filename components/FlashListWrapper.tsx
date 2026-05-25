import React from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';

interface Props<T> extends Omit<FlashListProps<T>, 'estimatedItemSize'> {
  estimatedItemSize?: number;
}

export default function FlashListWrapper<T>({ estimatedItemSize = 100, ...props }: Props<T>) {
  return <FlashList estimatedItemSize={estimatedItemSize} {...props} />;
}
