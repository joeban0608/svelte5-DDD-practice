import type { ITimelineRepoQuery } from '../domain/i-timeline.repo.query';

export class TimelineUseCaseQuery {
	private _timelineRepoQuery: ITimelineRepoQuery;
	get timelineRepoQuery() {
		return this._timelineRepoQuery;
	}
	constructor(timelineRepo: ITimelineRepoQuery) {
		this._timelineRepoQuery = timelineRepo;
	}

	public async getTimeline(timelineId: string) {
		return this._timelineRepoQuery.findById(timelineId);
	}

	public async listTimelines() {
		return this._timelineRepoQuery.list();
	}
}
