import type { ITimelineRepoQuery } from '../domain/i-timeline.repo.query';
import type { TimelineAggregate } from '../domain/timeline.ag';
import { eq, inArray } from 'drizzle-orm';
import { courses, students, timelines } from '$lib/server/db/schema';
import { TimelineMapper } from './drizzle.mapper';
import * as schema from '$lib/server/db/schema';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class DrizzleTimelineRepoQuery implements ITimelineRepoQuery {
	private _db: PostgresJsDatabase<typeof schema>;
	constructor(_db: PostgresJsDatabase<typeof schema>) {
		this._db = _db;
	}
	async findById(id: string): Promise<TimelineAggregate | null> {
		// 1. 先查 timeline row
		const [timeline] = await this._db.select().from(timelines).where(eq(timelines.id, id));
		if (!timeline) return null;

		// 2. 查 course rows (timelineId = id)
		const courseRows = await this._db.select().from(courses).where(eq(courses.timelineId, id));
		const courseIds = courseRows.map((c) => c.id);

		// 3. 查 student rows (courseId in courseIds)
		const studentRows =
			courseIds.length > 0
				? await this._db.select().from(students).where(inArray(students.courseId, courseIds))
				: [];

		// 4. 用 mapper 組裝 aggregate
		return TimelineMapper.toTimelines(timeline, courseRows, studentRows);
	}

	async list(): Promise<TimelineAggregate[]> {
		// 1. 先查所有 timeline row
		const timelineRows = await this._db.select().from(timelines);
		if (timelineRows.length === 0) return [];
		const timelineIds = timelineRows.map((t) => t.id);

		// 2. 查所有 course rows (timelineId in timelineIds)
		const courseRows = await this._db
			.select()
			.from(courses)
			.where(inArray(courses.timelineId, timelineIds));
		const courseIds = courseRows.map((c) => c.id);

		// 3. 查所有 student rows (courseId in courseIds)
		const studentRows =
			courseIds.length > 0
				? await this._db.select().from(students).where(inArray(students.courseId, courseIds))
				: [];

		// 4. 用 mapper 組裝所有 aggregate
		return timelineRows.map((timeline) => {
			const relatedCourses = courseRows.filter((course) => course.timelineId === timeline.id);
			const relatedCourseIds = relatedCourses.map((c) => c.id);
			const relatedStudents = studentRows.filter((student) =>
				relatedCourseIds.includes(student.courseId)
			);
			return TimelineMapper.toTimelines(timeline, relatedCourses, relatedStudents);
		});
	}
}
