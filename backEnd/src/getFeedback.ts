import * as AWS from 'aws-sdk'
import * as jwt from 'jsonwebtoken'

const docClient = new AWS.DynamoDB.DocumentClient()

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()

module.exports.main = function(event, context, callback) {
  const token = event.headers.Authorization.substring(7)
  const decodedJwt: any = jwt.decode(token, { complete: true })
  const isAdmin = decodedJwt.payload['cognito:groups']?.includes('admins')
  const cognitoUserName = decodedJwt.payload['username']

  const { email } = event.headers

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
        if (!isAdmin && cognitoEmail !== email) return callback('User admin access denied')

        const params = {
          TableName: 'employeeReviews',
          KeyConditionExpression: '#username = :usernameVal',
          ExpressionAttributeNames: {
            '#username': 'username',
          },
          ExpressionAttributeValues: {
            ':usernameVal': email,
          },
        }

        docClient.query(params, (err, data) => {
          if (err || !data.Items[0]?.assignedEmployees?.filter((employee) => employee)?.length) {
            const response200 = {
              statusCode: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
              body: isAdmin ? JSON.stringify({ employee: data }) : 'No assigned employees found',
            }
            return callback(null, response200)
          }

          const { assignedEmployees } = data.Items[0]

          const queryKeys = assignedEmployees
            .filter((employee) => employee)
            .map((username) => {
              return {
                username,
              }
            })
          const queryParams = {
            RequestItems: {},
          }
          queryParams.RequestItems['employeeReviews'] = {
            Keys: queryKeys,
          }
          console.log('queryKeys', queryKeys)

          docClient.batchGet(queryParams, function(error, batchData) {
            if (error) {
              console.log('failure:getItemByBatch data from Dynamo error', error)
            } else {
              console.log('success:getItemByBatch data from Dynamo data', batchData)
              const responseBody = isAdmin ? { assignedFeedback: batchData, employee: data } : batchData

              const response200 = {
                statusCode: 200,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(responseBody),
              }
              return callback(null, response200)
            }
          })
        })
      }
    },
  )
}
