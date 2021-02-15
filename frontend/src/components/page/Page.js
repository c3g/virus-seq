import cx from 'clsx'
import styles from './Page.module.css'

export default function Page({ children, className, background = true, ...rest }) {
  return (
    <div className={cx({ background }, styles.container, className)} {...rest}>
      {children}
    </div>
  )
}
