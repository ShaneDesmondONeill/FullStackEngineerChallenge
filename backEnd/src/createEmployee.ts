import * as AWS from 'aws-sdk'
import * as jwt from 'jsonwebtoken'

const resp200ok = {
  statusCode: 200,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: {},
}

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' })

module.exports.main = function(event, context, callback) {
  const token = event.headers.Authorization.substring(7)
  const decodedJwt: any = jwt.decode(token, { complete: true })
  const isAdmin = decodedJwt.payload['cognito:groups']?.includes('admins')
  if (!isAdmin) return callback('User admin access denied')

  const { password, email } = JSON.parse(event.body)

  const params = {
    UserPoolId: 'ap-northeast-1_sc7OMycVt',
    TemporaryPassword: password,
    Username: email,
    UserAttributes: [],
  }

  cognitoidentityserviceprovider.adminCreateUser(params, function(err, data) {
    if (err) {
      console.log(err, err.stack)
    } else {
      resp200ok.body = JSON.stringify(data)
      callback(null, resp200ok)
    }
  })
}
