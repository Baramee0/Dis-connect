import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection
} from 'discord.js'
import glob from 'glob'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { RegisterCommandsOptions } from '../typings/client'
import { CommandOptions } from '../typings/Command'
import { Event } from './Event'

const globPromise = promisify(glob)

export class ExtendedClient extends Client {
    commands: Collection<string, CommandOptions> = new Collection()

    constructor () {
        super({ intents: 32767 })
    }

    async start (): Promise<void> {
        await this.registerModules()
        await this.login(process.env.botToken)
    }

    async importFile (filePath: string): Promise<any> {
        return (await import(filePath))?.default
    }

    async registerCommands (options: RegisterCommandsOptions): Promise<void> {
        if (options.guildId != null && options.guildId === '') {
            this.guilds.cache.get(options.guildId)?.commands?.set(options.commands)
            console.log(`Registering commands to ${options.guildId}`)
        } else {
            this.application?.commands.set(options.commands)
            console.log('Registering global commands')
        }
    }

    async registerModules (): Promise<void> {
        // Commands
        const slashCommands: Array<ApplicationCommandDataResolvable> = []
        const commandFiles = await globPromise(
            join(__dirname, '..', 'commands', '*', '*{.ts,.js}')
        )

        for await (const filePath of commandFiles) {
            const command: CommandOptions = await this.importFile(filePath)

            if (command.name === '') {
                return
            }

            console.log(command)
            this.commands.set(command.name, command)
            slashCommands.push(command)
        }

        this.on('ready', async () => {
            await this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId
            })
        })

        // Event
        const eventFiles = await globPromise(
            join(__dirname, '..', 'events', '*{.ts,.js}')
        )

        for await (const filePath of eventFiles) {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath)
            this.on(event.event, event.run)
        }
    }
}
