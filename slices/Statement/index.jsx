import Image from 'next/image'
import styles from './Statement.module.scss'
import Button from '@/components/Button'
import { PrismicRichText, PrismicLink } from '@prismicio/react'

const Statement = ({ slice }) => {
  const {
    primary: {
      titleRow1,
      titleRow2,
      bodyText,
      graphicElements,
      backgroundImage,
      dimBackground,
    },
    items,
  } = slice

  return (
    <section className={styles.container}>
      {backgroundImage?.url && (
        <div
          className={`${styles.bgImageWrapper} ${
            styles['bgImageDim' + dimBackground]
          }`}>
          <Image
            draggable={false}
            alt=""
            src={backgroundImage.url}
            width={backgroundImage.dimensions.width}
            height={backgroundImage.dimensions.height}
            priority={true}
          />
        </div>
      )}
      {graphicElements && (
        <div className={styles.leftSvg}>
          <svg xmlns="http://www.w3.org/2000/svg">
            <path
              transform="rotate(180 -398.601 496)"
              id="svg_39"
              d="m-731.00251,-1.4877l831.00249,0c-91.79,0 -166.20049,222.73286 -166.20049,497.48769c0,274.75487 74.41049,497.48766 166.20049,497.48766l-831.00249,0l0,0c-91.79,0 -166.20049,-222.73282 -166.20049,-497.48766c0,-274.75483 74.41049,-497.48769 166.20049,-497.48769z"
              fill="var(--green-secondary)"
            />
          </svg>
        </div>
      )}
      <div
        className={`${
          backgroundImage?.url ? styles.wrapperWithBackground : styles.wrapper
        } ${graphicElements ? '' : styles.wrapperWithGraphics}`}>
        <div>
          <>
            {(titleRow1 || titleRow2) && (
              <div className={styles.title}>
                {titleRow1 && <PrismicRichText field={titleRow1} />}
                {titleRow2 && <PrismicRichText field={titleRow2} />}
              </div>
            )}
            {bodyText && (
              <div className={`${styles.textWrapper} subtitle`}>
                <PrismicRichText field={slice.primary.bodyText} />
              </div>
            )}
            {items.length > 0 && (
              <div className={styles.buttonWrapper}>
                {items.map(
                  (i, n) =>
                    i.buttonLabel && (
                      <PrismicLink field={i.buttonLink} key={'button' + n}>
                        <Button color={n === 0 ? 'green' : 'white'}>
                          {i.buttonLabel}
                        </Button>
                      </PrismicLink>
                    ),
                )}
              </div>
            )}
          </>
        </div>
      </div>
      {graphicElements && (
        <div className={styles.rightSvg}>
          <svg xmlns="http://www.w3.org/2000/svg">
            <path
              transform="rotate(180 -398.601 496)"
              d="m-731.00251,-1.4877l831.00249,0c-91.79,0 -166.20049,222.73286 -166.20049,497.48769c0,274.75487 74.41049,497.48766 166.20049,497.48766l-831.00249,0l0,0c-91.79,0 -166.20049,-222.73282 -166.20049,-497.48766c0,-274.75483 74.41049,-497.48769 166.20049,-497.48769z"
              fill="var(--green)"
            />
          </svg>
        </div>
      )}
    </section>
  )
}

export default Statement
