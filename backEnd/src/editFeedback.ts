import * as AWS from 'aws-sdk'
import * as jwt from 'jsonwebtoken'
const docClient = new AWS.DynamoDB.DocumentClient()

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()

module.exports.main = function(event, context, callback) {
  const token = event.headers.Authorization.substring(7)
  const decodedJwt: any = jwt.decode(token, { complete: true })

  const isAdmin = decodedJwt.payload['cognito:groups']?.includes('admins')
  const cognitoUserName = decodedJwt.payload['username']

  const { email, employeeSubmittedFeedback } = JSON.parse(event.body)

  cognitoidentityserviceprovider.adminGetUser(
    {
      UserPoolId: 'ap-northeast-1_sc7OMycVt',
      Username: cognitoUserName,
    },
    function(error, cognitoUser) {
      if (error) {
        console.log('failure:cognito getuser', error)
      } else {
        const cognitoEmail = cognitoUser.UserAttributes.find((Attribute) => Attribute.Name === 'email').Value

        const params = {
          TableName: 'employeeReviews',
          KeyConditionExpression: '#username = :usernameVal',
          ExpressionAttributeNames: {
            '#username': 'username',
          },
          ExpressionAttributeValues: {
            ':usernameVal': cognitoEmail,
          },
        }

        docClient.query(params, (err, data) => {
          if (err || !data.Items[0]) {
            const response200 = {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
              body: 'No assigned employees found',
            }
            return callback(null, response200)
          }
          const { assignedEmployees } = data.Items[0]
          const feedback = data.Items[0].feedback ? data.Items[0].feedback : []

          if (!isAdmin && !assignedEmployees.includes(email)) return callback('User admin access denied')

          const modifiedFeedback = feedback.concat({ [cognitoEmail]: employeeSubmittedFeedback })

          const params = {
            TableName: 'employeeReviews',
            Key: {
              username: email,
            },
            UpdateExpression: 'set feedback = :x',
            ExpressionAttributeValues: {
              ':x': modifiedFeedback,
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
        })
      }
    },
  )
}
