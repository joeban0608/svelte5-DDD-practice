import { db } from '../db';
import { TimelineUseCaseCommand } from './application/timeline.use-case.command';
import { TimelineUseCaseQuery } from './application/timeline.use-case.query';
import type { TimelineAggregate } from './domain/timeline.ag';
import { DrizzleTimelineRepoQuery } from './infrastructure/drizzle.timeline.repo.query';
import { DrizzleTimelineUnitOfWork } from './infrastructure/drizzle.timeline.uow';
// import { MockTimelineRepoQuery } from './infrastructure/mock-timeline.repo.query';
// import { MockTimelineUnitOfWork } from './infrastructure/mock-timeline.uow';
export async function _main_() {
	try {
		// mock UoW, Repo, UseCase
		// const timelineData = new Map();
		// const mockTimelineRepoQuery = new MockTimelineRepoQuery(timelineData);
		// const mockTimelineUow = new MockTimelineUnitOfWork(mockTimelineRepoQuery, timelineData);
		// const timelineUseCaseCommand = new TimelineUseCaseCommand(mockTimelineUow);
		// const timelineUseCaseQuery = new TimelineUseCaseQuery(mockTimelineUow);

		// Drizzle Uow, Repo, UseCase
		const drizzleTimelineRepoQuery = new DrizzleTimelineRepoQuery(db);
		const drizzleTimelineUow = new DrizzleTimelineUnitOfWork(db, drizzleTimelineRepoQuery);
		const timelineUseCaseCommand = new TimelineUseCaseCommand(drizzleTimelineUow);
		const timelineUseCaseQuery = new TimelineUseCaseQuery(drizzleTimelineUow);
		let listTimeline: TimelineAggregate[] = [];
		let findTimeline: TimelineAggregate | null = null;

		/* 
      create 1_1, 1_2 timeline
    */
		const createTimeline_1_1 = await timelineUseCaseCommand.createTimeline({
			day: 1,
			period: 1
		});
		console.log('*'.repeat(100) + '\n' + 'createTimeline_1_1 :', createTimeline_1_1);
		const createTimeline_1_2 = await timelineUseCaseCommand.createTimeline({
			day: 1,
			period: 2
		});
		console.log('createTimeline_1_2 :', createTimeline_1_2);
		listTimeline = await timelineUseCaseQuery.listTimelines();
		console.log('listTimeline :', JSON.stringify(listTimeline, null, 2));

		/* 
      delete 1_1 timeline
    */
		const deleteTimeline_1_1 = await timelineUseCaseCommand.deleteTimeline(createTimeline_1_1.id);
		console.log('*'.repeat(100) + '\n' + 'deleteTimeline_1_1 :', deleteTimeline_1_1);
		listTimeline = await timelineUseCaseQuery.listTimelines();
		console.log('listTimeline :', JSON.stringify(listTimeline, null, 2));

		/* 
			addCourse to 1_2 timeline
		*/

		try {
			const addCourseResult = await timelineUseCaseCommand.addCourseToTimeline(
				createTimeline_1_2.id,
				{
					name: 'Course 1',
					description: 'Description 1',
					studentCountRange: {
						min: 1,
						max: 2
					}
				}
			);
			console.log('*'.repeat(100) + '\n' + 'addCourseResult :', addCourseResult);
		} catch (error) {
			console.error('addCourseToTimeline Error :', error);
		}
		findTimeline = await timelineUseCaseQuery.getTimeline(createTimeline_1_2.id);
		console.log('findTimeline:', JSON.stringify(findTimeline, null, 2));
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred :', error);
	}
}
