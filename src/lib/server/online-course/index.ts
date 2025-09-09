import { db } from '$lib/server/db';
import { TimelineUseCaseCommand } from './application/timeline.use-case.command';
import { TimelineUseCaseQuery } from './application/timeline.use-case.query';
import type { TimelineAggregate } from './domain/timeline.ag';
import { DrizzleTimelineRepoCommand } from './infrastructure/drizzle.timeline.repo.command';
import { DrizzleTimelineRepoQuery } from './infrastructure/drizzle.timeline.repo.query';
import { DrizzleTimelineUnitOfWork } from './infrastructure/drizzle.timeline.uow';
// import { MockTimelineRepoCommand } from './infrastructure/mock-timeline.repo.command';
// import { MockTimelineRepoQuery } from './infrastructure/mock-timeline.repo.query';
// import { MockTimelineUnitOfWork } from './infrastructure/mock-timeline.uow';

export async function _main_() {
	try {
		// for mock repo
		// const timelineData = new Map();
		// const mockTimelineRepoCommand = new MockTimelineRepoCommand(timelineData);
		// const mockTimelineUow = new MockTimelineUnitOfWork(mockTimelineRepoCommand, timelineData);
		// const timelineUseCaseCommand = new TimelineUseCaseCommand(mockTimelineUow);
		// const mockTimelineRepoQuery = new MockTimelineRepoQuery(timelineData);
		// const timelineUseCaseQuery = new TimelineUseCaseQuery(mockTimelineRepoQuery);

		// for drizzle repo
		const drizzleTimelineRepoCommand = new DrizzleTimelineRepoCommand(db);
		const drizzleTimelineUow = new DrizzleTimelineUnitOfWork(drizzleTimelineRepoCommand);
		const timelineUseCaseCommand = new TimelineUseCaseCommand(drizzleTimelineUow);
		const drizzleTimelineRepoQuery = new DrizzleTimelineRepoQuery(db);
		const timelineUseCaseQuery = new TimelineUseCaseQuery(drizzleTimelineRepoQuery);

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
