declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string
            guildId: string
            environment: 'dev' | 'prod' | 'debug'
            MicrosoftAppId: string
            MicrosoftAppPassword: string
            MicrosoftAppTenantId: string
        }
    }
}
