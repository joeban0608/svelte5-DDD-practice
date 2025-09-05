import type { ITimelineRepoCommand } from '../domain/i-timeline.repo.command';
import type { TimelineAggregate } from '../domain/timeline.ag';

export class MockTimelineRepoCommand implements ITimelineRepoCommand {
	private _timelines: Map<string, TimelineAggregate>;

	constructor(timelineData: Map<string, TimelineAggregate>) {
		this._timelines = timelineData;
	}

	public async save(timeline: TimelineAggregate): Promise<void> {
		this._timelines.set(timeline.id.value, timeline);
	}

	public async delete(id: string): Promise<void> {
		this._timelines.delete(id);
	}

	public async findById(id: string): Promise<TimelineAggregate | null> {
		return this._timelines.get(id) ?? null;
	}
}
