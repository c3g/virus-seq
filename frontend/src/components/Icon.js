import cx from 'clsx'
import text from '../styles/text.module.css'


export default function Icon({ name, color }) {
  return (
    <span
      className={cx('fa', `fa-${name}`, text[color])}
    />
  )
}
