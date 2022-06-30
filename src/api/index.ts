import dotenv from 'dotenv'

import {
    AuthorizationCodeCredential,
    DeviceCodeCredential
} from '@azure/identity'
import {
    AuthenticationHandler,
    Client,
    Context,
    HTTPMessageHandler,
    Middleware
} from '@microsoft/microsoft-graph-client'
import {
    TokenCredentialAuthenticationProvider
} from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials'

dotenv.config()

class CustomLoggingHandler implements Middleware {
    private nextMiddleware: any = null

    execute = async (context: Context): Promise<void> => {
        // eslint-disable-next-line
        console.log(`Logging request: ${context.request.toString()}`)
        // eslint-disable-next-line
        return await this.nextMiddleware.execute(context)
    }

    setNext = (middleware: Middleware): void => {
        this.nextMiddleware = middleware
    }
}

const tenantId = process.env.tenantId
const clientId = process.env.clientId

const credentials = new DeviceCodeCredential({
    tenantId,
    clientId,
    userPromptCallback: (info) => {
        console.log('CUSTOMIZED PROMPT CALLBACK', info.message)
    }
})

const authProvider = new TokenCredentialAuthenticationProvider(credentials, {
    scopes: ['User.Read']
})

const credential = new AuthorizationCodeCredential(
    '<YOUR_TENANT_ID>',
    '<YOUR_CLIENT_ID>',
    '<AUTH_CODE_FROM_QUERY_PARAMETERS>',
    '<REDIRECT_URL>'
)

// Create an authentication handler that uses custom auth provider
const authHandler = new AuthenticationHandler(authProvider)

// Create a custom logging handler
const loggingHandler = new CustomLoggingHandler()

// Create a standard HTTP message handler
const httpHandler = new HTTPMessageHandler()

authHandler.setNext(loggingHandler)
loggingHandler.setNext(httpHandler)

const client = Client.initWithMiddleware({
    defaultVersion: 'v1.0',
    debugLogging: true,
    middleware: authHandler
})
const response: PageCollection = await client
    .api('/me/messages?$top=10&$select=sender,subject')
    .get()
