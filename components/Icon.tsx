import React from 'react'
import { Image } from 'react-native'
import { TabIcon } from '../assets/images/Image'

export default function Icon({ name, style, size }: { name:string, style: object, size: number }) {
  // @ts-ignore
  const icon = TabIcon[name]
  return (
    <Image
      source={icon}
      style={[{ width: size, height: size }, style]}
    />
  )
}
