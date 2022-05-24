import { CommandOptions } from '../typings/Command'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Command {
    constructor (options: CommandOptions) {
        Object.assign(this, options)
    }
}
