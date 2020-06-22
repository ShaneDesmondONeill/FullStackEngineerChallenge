import * as AWS from 'aws-sdk'
import * as jwt from 'jsonwebtoken'

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()

exports.main = function(event, context, callback) {
  const token = event.headers.Authorization.substring(7)
  const decodedJwt: any = jwt.decode(token, { complete: true })
  const isAdmin = decodedJwt.payload['cognito:groups']?.includes('admins')
  if (!isAdmin) return callback('User admin access denied')

  var params = {
    UserPoolId: 'ap-northeast-1_sc7OMycVt',
  }

  cognitoidentityserviceprovider.listUsers(params, (err, data) => {
    if (err) {
      console.log(err, err.stack)
      callback(err)
    } else {
      const resp200ok = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(data),
      }

      callback(null, resp200ok)
    }
  })
}
