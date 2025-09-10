import { CreatedAt } from '$lib/server/_share/domain/share.vo';
import type { courses, students, timelines } from '$lib/server/db/schema';
import { CourseEntity } from '../domain/course.en';
import {
	CourseDescription,
	CourseId,
	CourseName,
	CourseStudentCountRange
} from '../domain/course.vo';
import { StudentEntity } from '../domain/student.en';
import { StudentEmail, StudentId, StudentName } from '../domain/student.vo';
import { TimelineAggregate } from '../domain/timeline.ag';
import { TimelineDay, TimelineId, TimelinePeriod } from '../domain/timeline.vo';

type Timeline = typeof timelines.$inferSelect;
type Course = typeof courses.$inferSelect;
type Student = typeof students.$inferSelect;

export class TimelineMapper {
	public static toPersistence(aggregate: TimelineAggregate): {
		timeline: Timeline;
		courses: Course[];
		students: Student[];
	} {
		// 1. timeline row
		const timeline = {
			id: aggregate.id.value,
			day: aggregate.day.value,
			period: aggregate.period.value,
			createdAt: aggregate.createdAt.value
		};

		// 2. courses rows
		const courses = aggregate.courses.map((course) => ({
			id: course.id.value,
			timelineId: aggregate.id.value,
			name: course.name.value,
			description: course.description.value,
			studentCountMin: course.studentCountRange.value.min,
			studentCountMax: course.studentCountRange.value.max,
			createdAt: course.createdAt.value
		}));

		// 3. students rows
		const students = aggregate.courses.flatMap((course) =>
			course.students.map((student) => ({
				id: student.id.value,
				courseId: course.id.value,
				name: student.name.value,
				email: student.email.value,
				createdAt: student.createdAt.value
			}))
		);

		return { timeline, courses, students };
	}

	public static toTimelines(
		timeline: Timeline,
		courses: Course[],
		students: Student[]
	): TimelineAggregate {
		const courseEntities = courses.map((course) =>
			TimelineMapper.toCourses(
				course,
				students.filter((s) => s.courseId === course.id) // 依 courseId 分出對應的 students
			)
		);

		return TimelineAggregate.from(
			{
				id: TimelineId.create(timeline.id),
				day: TimelineDay.create(timeline.day),
				period: TimelinePeriod.create(timeline.period),
				createdAt: CreatedAt.create(timeline.createdAt)
			},
			courseEntities
		);
	}

	private static toCourses(primitive: Course, items: Student[]) {
		const students = items.map((student) => StudentEntity.from(TimelineMapper.toStudents(student)));
		return CourseEntity.from(
			{
				id: CourseId.create(primitive.id),
				name: CourseName.create(primitive.name),
				description: CourseDescription.create(primitive.description),
				studentCountRange: CourseStudentCountRange.create({
					min: primitive.studentCountMin,
					max: primitive.studentCountMax
				}),
				createdAt: CreatedAt.create(primitive.createdAt)
			},
			students
		);
	}

	private static toStudents(primitive: Student): StudentEntity {
		return StudentEntity.from({
			id: StudentId.create(primitive.id),
			name: StudentName.create(primitive.name),
			email: StudentEmail.create(primitive.email),
			createdAt: CreatedAt.create(primitive.createdAt)
		});
	}
}
