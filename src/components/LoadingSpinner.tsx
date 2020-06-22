import React from 'react'
import { css } from 'emotion'
import { loadingSpinnerStyles } from '../styles/LoadingSpinner'

function LoadingSpinner() {
  return (
    <div
      className={css`
        ${loadingSpinnerStyles}
      `}
    />
  )
}

export default LoadingSpinner
