import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '$lib/server/db/schema';
import type { ITimelineRepoQuery } from '../domain/i-timeline.repo.query';
import type { ITimelineRepoCommand } from '../domain/i-timeline.repo.command';
import type { IUnitOfWork } from '../domain/i-timeline.uow';
import { DrizzleTimelineRepoCommand } from './drizzle.timeline.repo.command';

export class DrizzleTimelineUnitOfWork implements IUnitOfWork {
	private _db: PostgresJsDatabase<typeof schema>;
	private _timelineRepoQuery: ITimelineRepoQuery;
	constructor(_db: PostgresJsDatabase<typeof schema>, _timelineRepoQuery: ITimelineRepoQuery) {
		this._db = _db;
		this._timelineRepoQuery = _timelineRepoQuery;
	}

	public get timelineRepoQuery(): ITimelineRepoQuery {
		return this._timelineRepoQuery;
	}

	public async execute<T>(fn: (repo: ITimelineRepoCommand) => Promise<T>): Promise<T> {
		return this._db.transaction(async (tx) => {
			// 在 transaction 裡面建立 command repo
			const timelineRepoCommand = new DrizzleTimelineRepoCommand(tx);
			return fn(timelineRepoCommand);
		});
	}
}
