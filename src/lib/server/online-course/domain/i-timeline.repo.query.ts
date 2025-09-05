import type { TimelineAggregate } from './timeline.ag';

export interface ITimelineRepoQuery {
	findById(id: string): Promise<TimelineAggregate | null>;
	list(): Promise<TimelineAggregate[]>;
}
