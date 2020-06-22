import React, { useEffect, useState } from 'react'
import { getFeedback, editEmployeeReview } from '../services/Apis'
import { Auth } from 'aws-amplify'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { css } from 'emotion'
import { flexContainer } from '../styles/flexContainer'
import { manageEmployeesStyles } from '../styles/ManageEmployees'
import { employeeViewStyles } from '../styles/EmployeeView'

import LoadingSpinner from '../components/LoadingSpinner'

type AssignedFeedback = {
  feedback?: { [key: string]: string }[]
  review?: string
  username: string
}

function EmployeeView({ logout }: { logout: Function }) {
  const [allAssignedFeedback, setAllAssignedFeedback] = useState<AssignedFeedback[] | undefined>(undefined)
  const [textInputValue, setTextInputValue] = useState('')
  const [email, setEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    ;(async function() {
      try {
        const user = await Auth.currentAuthenticatedUser()
        const conitoEmail = user.attributes.email
        setEmail(conitoEmail)

        getFeedback(conitoEmail).then((response) => {
          response
            .json()
            .then((readable) => {
              setAllAssignedFeedback(readable.Responses.employeeReviews)
            })
            .catch((error) => {
              console.log('error', error)
              setAllAssignedFeedback([])
            })
        })
      } catch (error) {
        console.log('error', error)
      }
    })()
  }, [email])
  return (
    <div
      className={css`
        ${flexContainer}
        ${manageEmployeesStyles}
        ${employeeViewStyles}
      `}
    >
      <h2>Assigned reviews</h2>
      <>
        {allAssignedFeedback ? (
          allAssignedFeedback.map((feedback) => {
            if (email && feedback.feedback?.find((item) => item.email)) return null
            return (
              <div className="employeeReviewCard">
                <h4>Employee Review for {feedback.username}</h4>
                <p>{feedback.review}</p>
                <TextInput
                  key={feedback.username}
                  value={textInputValue}
                  placeholder="Please write your feedback on this review"
                  required
                  title=""
                  onChange={setTextInputValue}
                />
                <Button
                  title="Submit"
                  onPress={() => {
                    editEmployeeReview(feedback.username, textInputValue)
                      .then(() => {
                        setAllAssignedFeedback(allAssignedFeedback.filter((item) => item !== feedback))
                      })
                      .catch((error) => console.log('error', error))
                  }}
                />
              </div>
            )
          })
        ) : (
          <LoadingSpinner />
        )}
      </>
      <div className="spacer" />

      <Button title="Logout" onPress={() => logout()} />
    </div>
  )
}

export default EmployeeView
