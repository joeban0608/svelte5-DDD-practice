import type { ITimelineRepoCommand } from '../domain/i-timeline.repo.command';
import type { ITimelineRepoQuery } from '../domain/i-timeline.repo.query';
import type { IUnitOfWork } from '../domain/i-timeline.uow';
import type { TimelineAggregate } from '../domain/timeline.ag';
import { MockTimelineRepoCommand } from './mock-timeline.repo.command';

// In-memory/mock 實作
export class MockTimelineUnitOfWork implements IUnitOfWork {
	private _timelineRepoQuery: ITimelineRepoQuery;
	private _timelineData: Map<string, TimelineAggregate>;

	constructor(timelineRepoQuery: ITimelineRepoQuery, timelineData: Map<string, TimelineAggregate>) {
		this._timelineRepoQuery = timelineRepoQuery;
		this._timelineData = timelineData;
	}

	get timelineRepoQuery(): ITimelineRepoQuery {
		return this._timelineRepoQuery;
	}

	async execute<T>(fn: (repo: ITimelineRepoCommand) => Promise<T>): Promise<T> {
		// clone a snapshot for rollback
		const snapshot = structuredClone(this._timelineData);

		try {
			const result = await fn(new MockTimelineRepoCommand(this._timelineData));
			return result;
		} catch (err) {
			// rollback: restore snapshot
			this._timelineData.clear();
			for (const [k, v] of snapshot.entries()) {
				this._timelineData.set(k, v);
			}
			throw err;
		}
	}
}
