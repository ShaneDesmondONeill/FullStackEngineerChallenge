import React from 'react'
import { css } from 'emotion'
import {modalStyles} from '../styles/Modal'

function Modal({ isDisplayed, children }: { isDisplayed: boolean; children: React.ReactNode }) {
  return (
    <>
      {isDisplayed ? (
        <div
          className={css`
            ${modalStyles}
          `}
        >
          {children}
        </div>
      ) : null}
    </>
  )
}

export default Modal
