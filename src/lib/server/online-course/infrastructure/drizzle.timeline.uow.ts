import { db } from '$lib/server/db';
import type { ITimelineRepoCommand } from '../domain/i-timeline.repo.command';
import type { IUnitOfWork } from '../domain/i-timeline.uow';
import { DrizzleTimelineRepoCommand } from './drizzle.timeline.repo.command';

export class DrizzleTimelineUnitOfWork implements IUnitOfWork {
	private _repo: ITimelineRepoCommand;
	constructor(repo: ITimelineRepoCommand) {
		this._repo = repo;
	}

	getTimelineRepoCommand(): ITimelineRepoCommand {
		return this._repo;
	}

	async execute<T>(fn: () => Promise<T>): Promise<T> {
		return db.transaction(async (tx) => {
			this._repo = new DrizzleTimelineRepoCommand(tx);
			const result = await fn();
			return result;
		});
	}
}
