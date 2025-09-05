import type { ITimelineRepoQuery } from '../domain/i-timeline.repo.query';
import type { TimelineAggregate } from '../domain/timeline.ag';

export class MockTimelineRepoQuery implements ITimelineRepoQuery {
	private _timelines: Map<string, TimelineAggregate>;

	constructor(timelineData: Map<string, TimelineAggregate>) {
		this._timelines = timelineData;
	}

	public async findById(id: string): Promise<TimelineAggregate | null> {
		return this._timelines.get(id) ?? null;
	}

	public async list(): Promise<TimelineAggregate[]> {
		return Array.from(this._timelines.values());
	}
}
