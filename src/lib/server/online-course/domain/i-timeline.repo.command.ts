import type { TimelineAggregate } from './timeline.ag';

export interface ITimelineRepoCommand {
	save(timeline: TimelineAggregate): Promise<void>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<TimelineAggregate | null>;
}
