import axios from 'axios'
import dotenv from 'dotenv'

import { AuthenticationProvider } from '@microsoft/microsoft-graph-client'

dotenv.config()

// eslint-ignore @typescript-eslint/camelcase
interface ClientCredentialAuthenticationProviderBody {
    client_id: string
    client_secret: string
    scope: string
    grant_type: string
}

interface ClientCredentialAuthenticationProviderResponseData {
    access_token: string
}

export class ClientCredentialAuthenticationProvider implements AuthenticationProvider {
    public async getAccessToken (): Promise<string> {
        const tenantId = process.env.MicrosoftAppTenantId ?? ''
        const url: string = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

        const body: ClientCredentialAuthenticationProviderBody = {
            client_id: process.env.MicrosoftAppId ?? '',
            client_secret: process.env.MicrosoftAppPassword ?? '',
            scope: 'https://graph.microsoft.com/.default',
            grant_type: 'client_credentials'
        }

        try {
            const response = await axios.request<ClientCredentialAuthenticationProviderResponseData>({
                url,
                data: body
            })

            if (response.status === 200) {
                return response.data.access_token
            } else {
                throw new Error('Non 200OK response on obtaining token...')
            }
        } catch (error) {
            console.error(error)
            throw new Error('Error on obtaining token...')
        }
    }
}
