import type { ITimelineRepoCommand } from './i-timeline.repo.command';
import type { ITimelineRepoQuery } from './i-timeline.repo.query';

export interface IUnitOfWork {
	readonly timelineRepoQuery: ITimelineRepoQuery;
	execute<T>(fn: (repo: ITimelineRepoCommand) => Promise<T>): Promise<T>;
}
