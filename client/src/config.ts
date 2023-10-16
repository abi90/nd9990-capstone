// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'io7u1wzjtf'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-bn7fjuxk0cuh3ums.us.auth0.com',            // Auth0 domain
  clientId: 'wGcAfipyumC72BKEKfRXgGSdb2Js6Y3V',          // Auth0 client id
  callbackUrl: `${window.origin}/callback`
}
