import { CreatedAt } from '$lib/server/_share/domain/share.vo';
import { CourseEntity } from './course.en';
import type { CourseDescription, CourseName, CourseStudentCountRange } from './course.vo';
import { TimelineDay, TimelineId, TimelinePeriod } from './timeline.vo';

export type TimelineProps = {
	id: TimelineId;
	day: TimelineDay; // 1 - 5 天
	period: TimelinePeriod; // 1天最多 3節課 (max: 3)
	createdAt: CreatedAt; // timestamp
};

export class TimelineAggregate {
	public readonly id: TimelineId;
	public readonly _createdAt: CreatedAt; // timestamp
	private _day: TimelineDay; // 1 - 5 天
	private _period: TimelinePeriod; // 1天最多 3節課 (max: 3)

	private _courses: CourseEntity[];

	private constructor(props: TimelineProps, courses: CourseEntity[]) {
		this.id = props.id;
		this._day = props.day;
		this._period = props.period;
		this._courses = courses;

		this._createdAt = props.createdAt;
	}

	get day() {
		return this._day;
	}

	get period() {
		return this._period;
	}

	get createdAt() {
		return this._createdAt;
	}

	get courses() {
		return this._courses;
	}

	public static create(props: Omit<TimelineProps, 'id' | 'createdAt'>): TimelineAggregate {
		return new TimelineAggregate(
			{
				...props,
				id: TimelineId.create(crypto.randomUUID()),
				createdAt: CreatedAt.create(Date.now())
			},
			[]
		);
	}

	public static from(primitive: TimelineProps, courses: CourseEntity[]): TimelineAggregate {
		return new TimelineAggregate(primitive, courses);
	}

	public async addCourse({
		name,
		description,
		studentCountRange
	}: {
		name: CourseName;
		description: CourseDescription;
		studentCountRange: CourseStudentCountRange;
	}): Promise<{ id: string }> {
		const courseEntity = CourseEntity.create({
			name,
			description,
			studentCountRange
		});
		this._courses.push(courseEntity);
		return {
			id: courseEntity.id.value
		};
	}
}
