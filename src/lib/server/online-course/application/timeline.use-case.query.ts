import type { IUnitOfWork } from '../domain/i-timeline.uow';

export class TimelineUseCaseQuery {
	private uow: IUnitOfWork;
	constructor(uow: IUnitOfWork) {
		this.uow = uow;
	}

	get timelineRepoQuery() {
		return this.uow.timelineRepoQuery;
	}

	public async getTimeline(timelineId: string) {
		return this.uow.timelineRepoQuery.findById(timelineId);
	}

	public async listTimelines() {
		return this.uow.timelineRepoQuery.list();
	}
}
