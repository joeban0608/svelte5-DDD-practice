import type { ITimelineRepoCommand } from "./i-timeline.repo.command";

export interface IUnitOfWork {
	execute<T>(fn: () => Promise<T>): Promise<T>;
	getTimelineRepoCommand(): ITimelineRepoCommand;
}
