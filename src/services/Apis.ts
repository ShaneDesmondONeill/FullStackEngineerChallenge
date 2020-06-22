import { Auth } from 'aws-amplify'

export const getAccessToken = async () => {
  const accessToken = (await Auth.currentSession()).getAccessToken().getJwtToken()
  localStorage.setItem('accessToken', JSON.stringify(accessToken))
  return accessToken
}

const prodEndPoint = 'https://zjehuho4k0.execute-api.ap-northeast-1.amazonaws.com/dev/api/'
const localEndpoint = 'http://localhost:4000/dev/api/'
const endPoint = process.env.NODE_ENV === 'production' ? prodEndPoint : localEndpoint

export const getEmployees = async () => {
  const accessToken = (await Auth.currentSession()).getAccessToken().getJwtToken()

  const response = await fetch(endPoint + 'getEmployees', {
    method: 'GET',
    headers: { Authorization: `bearer ${accessToken}` },
  })

  return response
}

export const createEmployee = async (invitedUserEmailAddress: string, password: string) => {
  const accessToken = (await Auth.currentSession()).getAccessToken().getJwtToken()
  const response = await fetch(endPoint + 'createEmployee', {
    method: 'PUT',
    headers: { Authorization: `bearer ${accessToken}` },
    body: JSON.stringify({
      email: invitedUserEmailAddress,
      password,
    }),
  })

  return response
}

export const writeEmployeeReview = async (username: string, review: string, assignedEmployees: string[]) => {
  const accessToken = (await Auth.currentSession()).getAccessToken().getJwtToken()
  const response = await fetch(endPoint + 'writeReview', {
    method: 'PUT',
    headers: { Authorization: `bearer ${accessToken}` },
    body: JSON.stringify({
      username,
      review,
      assignedEmployees,
    }),
  })

  return response
}

export const getFeedback = async (email: string) => {
  const accessToken = (await Auth.currentSession()).getAccessToken().getJwtToken()
  const response = await fetch(endPoint + 'getFeedback', {
    method: 'GET',
    headers: { Authorization: `bearer ${accessToken}`, email },
  })

  return response
}

export const editEmployeeReview = async (email: string, employeeSubmittedFeedback: string) => {
  const accessToken = (await Auth.currentSession()).getAccessToken().getJwtToken()
  const response = await fetch(endPoint + 'editFeedback', {
    method: 'PUT',
    headers: { Authorization: `bearer ${accessToken}` },
    body: JSON.stringify({
      email,
      employeeSubmittedFeedback,
    }),
  })

  return response
}
