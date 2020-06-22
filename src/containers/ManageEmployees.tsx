import React, { useState, useEffect, useCallback } from 'react'
import { css } from 'emotion'
import { flexContainer } from '../styles/flexContainer'
import { manageEmployeesStyles } from '../styles/ManageEmployees'

import Button from '../components/Button'
import Modal from '../components/Modal'
import TextInput from '../components/TextInput'
import { createEmployee, getEmployees } from '../services/Apis'
import EmployeeCard from '../components/EmployeeCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Icon from '../components/Icon'

export type User = {
  Username: string
  Attributes: { Name: string; Value: string }[]
  Enabled: boolean
  UserCreateDate: string
  UserLastModifiedDate: string
  UserStatus: string
}

function ManageEmployees({ logout }: { logout: Function }) {
  const [isAddEmployeeModalDisplayed, setIsAddEmployeeModalDisplayed] = useState(false)
  const [email, setEmail] = useState('')
  const [users, setUsers] = useState<User[] | undefined>(undefined)

  const onSubmit = useCallback((textInput: string) => {
    createEmployee(textInput, 'testtest') // FIXME: for convenience
    setIsAddEmployeeModalDisplayed(false)
  }, [])

  useEffect(() => {
    getEmployees().then((response) => {
      response.json().then((readable) => {
        setUsers(readable.Users)
      })
    })
  }, [onSubmit])

  return (
    <>
      <div
        className={css`
          ${flexContainer}
          ${manageEmployeesStyles}
        `}
      >
        <header className="headerContainer">
          <img src="https://image.paypay.ne.jp/page/common/images/img_logo.png" alt="Pay Pay Logo" />

          <Button title="Logout" onPress={() => logout()} />
        </header>
        <section>
          <h3>Existing Employees</h3>
          <div className="employeesContainer">
            {!users ? (
              <LoadingSpinner />
            ) : (
              <> {users && users.map((user) => <EmployeeCard {...user} key={user.Username} allUsers={users} />)} </>
            )}
          </div>
          <Button title="Add Employee" onPress={() => setIsAddEmployeeModalDisplayed(true)} />
        </section>
      </div>
      <Modal isDisplayed={isAddEmployeeModalDisplayed}>
        <Icon name="close" onClick={() => setIsAddEmployeeModalDisplayed(false)} />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(email)
          }}
        >
          <TextInput
            type="email"
            pattern={'^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'}
            required
            title="Add Employee"
            placeholder="Email"
            value={email}
            onChange={(value) => setEmail(value)}
          />
          <Button title="Submit" type="submit" />
        </form>
      </Modal>
    </>
  )
}

export default ManageEmployees
