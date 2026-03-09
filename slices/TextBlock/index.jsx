import { PrismicRichText, PrismicLink } from '@prismicio/react'
import styles from './TextBlock.module.scss'
import Button from '@/components/Button'

const TextBlock = ({ slice }) => {
  const {
    primary: { content },
    items,
  } = slice

  return (
    <div className={`${styles.container} grid container`}>
      <div className={styles.content}>
        <>
          <div className="richtext">
            <PrismicRichText field={content} />
          </div>
          {items.length > 0 && items[0].buttonLabel && (
            <div className={styles.buttons}>
              {items.map((i, n) => (
                <PrismicLink
                  key={'button' + n}
                  field={i.buttonLink}
                  className={styles.buttonWrapper}>
                  <Button color={n % 2 === 0 ? 'white' : 'contrast'}>
                    {i.buttonLabel}
                  </Button>
                </PrismicLink>
              ))}
            </div>
          )}
        </>
      </div>
    </div>
  )
}

export default TextBlock
