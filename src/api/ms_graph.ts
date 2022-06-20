const {
    TokenCredentialAuthenticationProvider
} = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials')
const {
    AuthorizationCodeCredential
} = require('@azure/identity')

const credential = new AuthorizationCodeCredential(
    '<f8cdef31-a31e-4b4a-93e4-5f571e91255a>',
    '<3a4a0e87-2029-4681-b09d-4e7e1fe1947d>',
    '<AUTH_CODE_FROM_QUERY_PARAMETERS>',
    '<http://localhost>'
)

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: [scopes]
})

// Create an authentication handler that uses custom auth provider
const authHandler = new MicrosoftGraph.AuthenticationHandler(authProvider)

// Create a custom logging handler
const loggingHandler = new CustomLoggingHandler()

// Create a standard HTTP message handler
const httpHandler = new MicrosoftGraph.HTTPMessageHandler()

// Use setNext to chain handlers together
// auth -> logging -> http
authHandler.setNext(loggingHandler)
loggingHandler.setNext(httpHandler)

// Pass the first middleware in the chain in the middleWare property
const client = MicrosoftGraph.Client.initWithMiddleware({
    defaultVersion: 'v1.0',
    debugLogging: true,
    middleware: authHandler
})

const response: PageCollection = await client
    .api('/me/messages?$top=10&$select=sender,subject')
    .get()
