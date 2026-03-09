import styles from './EnergyLabel.module.scss'
import Image from 'next/image'

const EnergyLabel = ({ label, ...props }) => {
  // Validate label
  const validLabels = ['a', 'a+', 'a++', 'a+++', 'b', 'c', 'd', 'e', 'f', 'g']

  if (typeof label !== 'string' || validLabels.includes(label.toLowerCase))
    return null

  return (
    <div className={styles.energyLabel} {...props}>
      <Image
        draggable={false}
        width={70}
        height={32}
        src={`/energylabels/${label.toLowerCase()}.svg`}
        alt={`Energy label ${label.toLowerCase()}`}
      />
    </div>
  )
}

export default EnergyLabel
