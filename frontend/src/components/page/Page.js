import cx from 'clsx'
import styles from './Page.module.css'

export default function Page({
  children,
  className,
  background = true,
  center = false,
  ...rest
}) {
  return (
    <div
      className={cx(
        { background },
        styles.container,
        center ? styles.center : undefined,
        (center === true || center === 'horizontal') ? styles.horizontal : undefined,
        (center === true || center === 'vertical') ? styles.vertical : undefined,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
