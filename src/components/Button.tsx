import React from 'react'
import { css } from 'emotion'
import { buttonStyles } from '../styles/Button'

function Button({
  title,
  onPress,
  ...rest
}: {
  title: string
  onPress?: () => void
  type?: 'button' | 'submit' | 'reset' | undefined
}) {
  return (
    <button
      {...rest}
      className={css`
        ${buttonStyles}
      `}
      {...(onPress && { onClick: onPress })}
    >
      {title}
    </button>
  )
}

export default Button
