import { Event } from '../index';
import { Client } from 'discord.js';
import { customClient } from '../../index';
import { connect } from 'mongoose';
import { SimpleIntervalJob, Task } from 'toad-scheduler';
import { refreshStatus } from '../../helpers/status';

export const ready: Event = {
  name: 'ready',
  once: false,
  execute: async (argclient: Client<true>, client: customClient) => {
    console.log(`${client.user?.tag} is ready!`);

    // Database connection
    if (process.env.MONGO) {
      client.db = await connect(process.env.MONGO);
      if (client.db.connection.readyState === 1) console.log('Database is ready!');
    }

    // Client scheduler
    const statusTask = new Task(
      'refreshStatus',
      () => refreshStatus(client),
      (e) => {
        console.log(e);
      }
    );
    const statusJob = new SimpleIntervalJob({ minutes: 10, runImmediately: true }, statusTask);
    client.scheduler.addSimpleIntervalJob(statusJob);
  }
};
