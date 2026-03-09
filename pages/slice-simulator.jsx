import { SliceSimulator } from '@slicemachine/adapter-next/simulator'
import { SliceZone } from '@prismicio/react'

import { components } from '../slices'
import styles from './SliceSimulatorPage.module.scss'

const SliceSimulatorPage = () => {
  return (
    <SliceSimulator
      className={styles.wrapper}
      sliceZone={props => <SliceZone {...props} components={components} />}
    />
  )
}

export default SliceSimulatorPage
