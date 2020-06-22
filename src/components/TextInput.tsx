import React from 'react'
import { css } from 'emotion'
import { inputStyles } from '../styles/TextInput'

function TextInput({
  title,
  message,
  placeholder,
  type,
  value,
  onChange,
  ...rest
}: {
  title: string
  onChange: (textInputValue: string) => void
  message?: string
  placeholder: string
  type?: string
  pattern?: string
  required?: boolean
  value: string
}) {
  return (
    <div
      className={css`
        ${inputStyles}
      `}
    >
      <h4>{title}</h4>
      {message ? <p>{message}</p> : null}
      <input
        {...rest}
        value={value}
        type={type}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
      ></input>
    </div>
  )
}

export default TextInput
