import { CourseDescription, CourseName, CourseStudentCountRange } from '../domain/course.vo';
import type { ITimelineRepoCommand } from '../domain/i-timeline.repo.command';
import { TimelineAggregate } from '../domain/timeline.ag';
import { TimelineDay, TimelinePeriod } from '../domain/timeline.vo';

export class TimelineUseCaseCommand {
	private _timelineRepoCommand: ITimelineRepoCommand;
	constructor(timelineRepo: ITimelineRepoCommand) {
		this._timelineRepoCommand = timelineRepo;
	}

	get timelineRepoCommand() {
		return this._timelineRepoCommand;
	}

	public async createTimeline({
		day,
		period
	}: {
		day: number;
		period: number;
	}): Promise<{ id: string }> {
		const ag = TimelineAggregate.create({
			day: TimelineDay.create(day),
			period: TimelinePeriod.create(period)
		});
		await this._timelineRepoCommand.save(ag);
		return {
			id: ag.id.value
		};
	}

	public async deleteTimeline(id: string): Promise<{ id: string }> {
		const found = await this._timelineRepoCommand.findById(id);
		if (!found) throw new Error('Timeline not found');

		await this._timelineRepoCommand.delete(id);
		return {
			id: found.id.value
		};
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
		const foundAg = await this._timelineRepoCommand.findById(timelineId);
		if (!foundAg) throw new Error('Timeline not found');

		const createResult = await foundAg.addCourse({
			name: CourseName.create(courseInput.name),
			description: CourseDescription.create(courseInput.description),
			studentCountRange: CourseStudentCountRange.create(courseInput.studentCountRange)
		});

		await this._timelineRepoCommand.save(foundAg);
		return {
			timelineId: foundAg.id.value,
			courseId: createResult.id
		};
	}
}
