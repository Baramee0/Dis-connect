import { Context, Middleware } from '@microsoft/microsoft-graph-client'

export default class CustomLoggingHandler implements Middleware {
    private nextMiddleware: any = null

    execute = async (context: Context): Promise<void> => {
        console.log(`Logging request: ${context.request.toString()}`)
        return await this.nextMiddleware.execute(context)
    }

    setNext = (middleware: Middleware): void => {
        this.nextMiddleware = middleware
    }
}
