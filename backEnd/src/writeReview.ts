import * as AWS from 'aws-sdk'
import * as jwt from 'jsonwebtoken'
const docClient = new AWS.DynamoDB.DocumentClient()

module.exports.main = async function(event, context, callback) {
  const { username, review, assignedEmployees } = JSON.parse(event.body)
  const token = event.headers.Authorization.substring(7)
  const decodedJwt: any = jwt.decode(token, { complete: true })
  const isAdmin = decodedJwt.payload['cognito:groups']?.includes('admins')
  if (!isAdmin) return callback('User admin access denied')

  const params = {
    TableName: 'employeeReviews',
    Key: {
      username,
    },
    UpdateExpression: 'set review = :x, assignedEmployees = :y',
    ExpressionAttributeValues: {
      ':x': review,
      ':y': assignedEmployees,
    },
  }

  return docClient.update(params, (err, data) => {
    if (err) {
      console.log('Unable to add item. Error JSON:', JSON.stringify(err))
      return callback(err)
    }

    const response = {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: 'Success',
    }
    return callback(null, response)
  })
}
