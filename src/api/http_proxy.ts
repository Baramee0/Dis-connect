// Create a credential from @azure/identity package
const credential = new ClientSecretCredential(
    'f8cdef31-a31e-4b4a-93e4-5f571e91255a',
    '3a4a0e87-2029-4681-b09d-4e7e1fe1947d',
    '81180f49-46e4-4112-b346-c444f8e5eef8',
    {
        proxyOptions: {
            host: 'localhost',
            port: 8888
        // If proxy requires authentication
        // username: '',
        // password: ''
        }
    }
)

// Create a Graph token credential provider
const tokenAuthProvider = new TokenCredentialAuthenticationProvider(
    credential,
    {
        scopes: ['https://graph.microsoft.com/.default']
    })

const client = MicrosoftGraph.Client.initWithMiddleware({
    authProvider: tokenAuthProvider,
    // Configure proxy in fetchOptions
    fetchOptions: {
        agent: new HttpsProxyAgent('http://localhost:8888')
    }
})
