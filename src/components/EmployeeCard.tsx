import React, { useState } from 'react'
import { User } from '../containers/ManageEmployees'
import { css } from 'emotion'
import { writeEmployeeReview, getFeedback } from '../services/Apis'
import Modal from './Modal'
import TextInput from './TextInput'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner'
import Icon from './Icon'
import { employeeCardStyles, employeeModalStyles } from '../styles/EmployeeCard'

type FeedbackResponse = {
  assignedEmployees: string[]
  feedback: { [key: string]: string[] }
  review: string
  username: string
}

type Props = {
  Username: string
  UserCreateDate: string
  Attributes: { Name: string; Value: string }[]
  allUsers: User[]
}

function EmployeeCard({ Username, UserCreateDate, Attributes, allUsers }: Props) {
  const [textInputValue, setTextInputValue] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackResponse[] | undefined>(undefined)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([''])
  const [employeeData, setEmployeeData] = useState<any>(undefined)

  const email = Attributes.find((item) => item.Name === 'email')!.Value
  const getEmail = (attributes: Props['Attributes']) => attributes.find((item) => item.Name === 'email')?.Value

  const getEmployeeFeedback = () => {
    getFeedback(email).then((response) => {
      response
        .json()
        .then((readable) => {
          setEmployeeData(readable.employee.Items[0])
          setFeedback(readable.assignedFeedback?.Responses?.employeeReviews ?? [])
          setTextInputValue(readable.employee.Items[0].review)
        })
        .catch((error) => {
          console.log('error', error)
          setFeedback([])
        })
    })
    setOpenModal(true)
  }

  return (
    <>
      <div
        className={css`
          ${employeeCardStyles}
        `}
        onClick={() => getEmployeeFeedback()}
      >
        {getEmail(Attributes)}
        <Icon name="create" />
      </div>

      <div
        className={css`
          ${employeeModalStyles}
        `}
      >
        <Modal isDisplayed={openModal}>
          <Icon name="close" onClick={() => setOpenModal(false)} />
          {feedback ? (
            <form
              onSubmit={() => {
                writeEmployeeReview(email, textInputValue, selectedUsers)
                setOpenModal(false)
              }}
            >
              <TextInput
                value={textInputValue}
                placeholder="Employee Review"
                required
                title="Write Review"
                onChange={setTextInputValue}
              />
              <h4>Add Employees to Give Feedback</h4>
              {allUsers.map((user) => {
                const CheckboxEmail = getEmail(user.Attributes)

                // prevent assigning employee to himself or
                if (!CheckboxEmail || email === CheckboxEmail || employeeData?.assigned?.includes(CheckboxEmail)) return null

                const feedbackObject = employeeData?.feedback?.find((item: any) => item[CheckboxEmail])
                const checkBoxFeedback = feedbackObject ? feedbackObject[CheckboxEmail] : null

                return (
                  <div key={CheckboxEmail}>
                    {checkBoxFeedback ? (
                      <div className="feedbackBox">
                        <label>{CheckboxEmail}:</label>
                        <p>{checkBoxFeedback}</p>
                      </div>
                    ) : (
                      <div key={CheckboxEmail} className="checkbox">
                        <input
                          id={CheckboxEmail}
                          value={CheckboxEmail}
                          type="checkbox"
                          onChange={() => setSelectedUsers(selectedUsers.concat(CheckboxEmail))}
                        />
                        <label htmlFor={CheckboxEmail}>{CheckboxEmail}</label>
                      </div>
                    )}
                  </div>
                )
              })}
              <Button title="Submit" type="submit" />
            </form>
          ) : (
            <LoadingSpinner />
          )}
        </Modal>
      </div>
    </>
  )
}

export default EmployeeCard
