import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import './normalize.css'
import Auth from '@aws-amplify/auth'
import * as jwt from 'jsonwebtoken'

import Login from './containers/Login'
import { css } from 'emotion'
import ManageEmployees from './containers/ManageEmployees'
import { standardTypography } from './styles/typography'
import Amplify from 'aws-amplify'
import awsExports from './aws-exports'
import { getAccessToken } from './services/Apis'
import EmployeeView from './containers/EmployeeView'

Amplify.configure(awsExports)

const appStyles = `
  font-family: 'Roboto';
  background: #efefef;
  min-height: 100vh;
  display: flex;

  .error {
    color: #e22020;
  } 

  .spacer {
    height: 50px;
  }
`

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    getAccessToken().then((response) => {
      if (response) {
        const decodedJwt: any = jwt.decode(response, { complete: true })
        const isAdmin = decodedJwt?.payload['cognito:groups']?.includes('admins')

        setIsAdmin(isAdmin)
        setIsAuthenticated(true)
      }
    })
  }, [])

  return (
    <>
      <Helmet>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Icons&family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div
        className={css`
          ${appStyles}
          ${standardTypography}
        `}
      >
        {isAuthenticated ? (
          <>
            {isAdmin ? (
              <ManageEmployees
                logout={() => {
                  Auth.signOut()
                  setIsAuthenticated(false)
                  setIsAdmin(false)
                }}
              />
            ) : (
              <EmployeeView
                logout={() => {
                  Auth.signOut()
                  setIsAuthenticated(false)
                  setIsAdmin(false)
                }}
              />
            )}
          </>
        ) : (
          <Login
            login={(username: string, password: string) =>
              Auth.signIn(username, password).then(() => setIsAuthenticated(true))
            }
          />
        )}
      </div>
    </>
  )
}

export default App
