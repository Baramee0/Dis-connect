import axios from 'axios'
import qs from 'qs'

import { AuthenticationProvider } from '@microsoft/microsoft-graph-client'

export class ClientCredentialAuthenticationProvider implements AuthenticationProvider {
    public async getAccessToken (): Promise<string> {
        const url: string = 'https://login.microsoftonline.com/' + process.env.MicrosoftAppTenantId + '/oauth2/v2.0/token'

        const body: object = {
            client_id: process.env.MicrosoftAppId,
            client_secret: process.env.MicrosoftAppPassword,
            scope: 'https://graph.microsoft.com/.default',
            grant_type: 'client_credentials'
        }

        try {
            const response = await axios.post(url, qs.stringify(body))

            if (response.status === 200) {
                return response.data.access_token
            } else {
                throw new Error('Non 200OK response on obtaining token...')
            }
        } catch (error) {
            throw new Error('Error on obtaining token...')
        }
    }
}
