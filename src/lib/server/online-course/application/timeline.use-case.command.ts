import { CourseDescription, CourseName, CourseStudentCountRange } from '../domain/course.vo';
import type { ITimelineRepoCommand } from '../domain/i-timeline.repo.command';
import type { IUnitOfWork } from '../domain/i-timeline.uow';
import { TimelineAggregate } from '../domain/timeline.ag';
import { TimelineDay, TimelinePeriod } from '../domain/timeline.vo';

export class TimelineUseCaseCommand {
	private uow: IUnitOfWork;
	constructor(uow: IUnitOfWork) {
		this.uow = uow;
	}
	public async createTimeline({
		day,
		period
	}: {
		day: number;
		period: number;
	}): Promise<{ id: string }> {
		return this.uow.execute(async (repo: ITimelineRepoCommand) => {
			const ag = TimelineAggregate.create({
				day: TimelineDay.create(day),
				period: TimelinePeriod.create(period)
			});
			await repo.save(ag);
			return {
				id: ag.id.value
			};
		});
	}

	public async deleteTimeline(id: string): Promise<{ id: string }> {
		return this.uow.execute(async (repo: ITimelineRepoCommand) => {
			const found = await repo.findById(id);
			if (!found) throw new Error('Timeline not found');

			await repo.delete(id);
			return {
				id: found.id.value
			};
		});
	}

	public async addCourseToTimeline(
		timelineId: string,
		courseInput: {
			name: string;
			description: string;
			studentCountRange: {
				min: number;
				max: number;
			};
		}
	): Promise<{
		timelineId: string;
		courseId: string;
	}> {
		return this.uow.execute(async (repo: ITimelineRepoCommand) => {
			const foundAg = await repo.findById(timelineId);
			if (!foundAg) throw new Error('Timeline not found');

			const createResult = await foundAg.addCourse({
				name: CourseName.create(courseInput.name),
				description: CourseDescription.create(courseInput.description),
				studentCountRange: CourseStudentCountRange.create(courseInput.studentCountRange)
			});

			// throw new Error('Method not implemented.');
			await repo.save(foundAg);
			return {
				timelineId: foundAg.id.value,
				courseId: createResult.id
			};
		});
	}
}
