import React from 'react'
import type {MeasuredDimensions} from 'react-native-reanimated'

import {useNonReactiveCallback} from '#/lib/hooks/useNonReactiveCallback'
import {ImageSource} from '#/view/com/lightbox/ImageViewing/@types'

type Lightbox = {
  images: ImageSource[]
  thumbDims: MeasuredDimensions | null
  index: number
}

const LightboxContext = React.createContext<{
  activeLightbox: Lightbox | null
}>({
  activeLightbox: null,
})

const LightboxControlContext = React.createContext<{
  openLightbox: (lightbox: Lightbox) => void
  closeLightbox: () => boolean
}>({
  openLightbox: () => {},
  closeLightbox: () => false,
})

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [activeLightbox, setActiveLightbox] = React.useState<Lightbox | null>(
    null,
  )

  const openLightbox = useNonReactiveCallback((lightbox: Lightbox) => {
    setActiveLightbox(lightbox)
  })

  const closeLightbox = useNonReactiveCallback(() => {
    let wasActive = !!activeLightbox
    setActiveLightbox(null)
    return wasActive
  })

  const state = React.useMemo(
    () => ({
      activeLightbox,
    }),
    [activeLightbox],
  )

  const methods = React.useMemo(
    () => ({
      openLightbox,
      closeLightbox,
    }),
    [openLightbox, closeLightbox],
  )

  return (
    <LightboxContext.Provider value={state}>
      <LightboxControlContext.Provider value={methods}>
        {children}
      </LightboxControlContext.Provider>
    </LightboxContext.Provider>
  )
}

export function useLightbox() {
  return React.useContext(LightboxContext)
}

export function useLightboxControls() {
  return React.useContext(LightboxControlContext)
}
