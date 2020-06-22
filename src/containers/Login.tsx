import React, { useState } from 'react'
import Button from '../components/Button'
import { flexContainer } from '../styles/flexContainer'
import LoadingSpinner from '../components/LoadingSpinner'

import { css } from 'emotion'
import TextInput from '../components/TextInput'

function Login({ login, isLoading, isAuthenticated, user, error }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div
          className={css`
            ${flexContainer}
          `}
        >
          <img src="https://image.paypay.ne.jp/page/common/images/img_logo.png" alt="Pay Pay Logo" />
          <h2>Human Resources Service</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              login(email, password)
            }}
          >
            <TextInput
              type="email"
              pattern={'^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'}
              required
              title=""
              placeholder="Email"
              value={email}
              onChange={(value) => {
                setEmail(value)
              }}
            />
            <TextInput
              type="password"
              title=""
              required
              placeholder="Password"
              value={password}
              onChange={(value) => {
                setPassword(value)
              }}
            />
            {error?.message ? <p className="error">{error.message}</p> : null}
            <div className="spacer" />
            <Button title="Login" />
          </form>
        </div>
      )}
    </>
  )
}

export default Login
