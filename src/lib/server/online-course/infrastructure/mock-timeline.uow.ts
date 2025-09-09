import type { ITimelineRepoCommand } from '../domain/i-timeline.repo.command';
import type { IUnitOfWork } from '../domain/i-timeline.uow';
import type { TimelineAggregate } from '../domain/timeline.ag';

// In-memory/mock 實作
export class MockTimelineUnitOfWork implements IUnitOfWork {
	private timelineRepo: ITimelineRepoCommand;
	private timelineData: Map<string, TimelineAggregate>;

	constructor(repo: ITimelineRepoCommand, timelineData: Map<string, TimelineAggregate>) {
		this.timelineRepo = repo;
		this.timelineData = timelineData;
	}

	async execute<T>(fn: () => Promise<T>): Promise<T> {
		// clone a snapshot for rollback
		const snapshot = structuredClone(this.timelineData);

		try {
			const result = await fn();
			return result;
		} catch (err) {
			// rollback: restore snapshot
			this.timelineData.clear();
			for (const [k, v] of snapshot.entries()) {
				this.timelineData.set(k, v);
			}
			throw err;
		}
	}

	getTimelineRepoCommand(): ITimelineRepoCommand {
		return this.timelineRepo;
	}
}
