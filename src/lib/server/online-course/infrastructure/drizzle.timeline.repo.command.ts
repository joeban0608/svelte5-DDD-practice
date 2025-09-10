import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '$lib/server/db/schema';
import type { ITimelineRepoCommand } from '../domain/i-timeline.repo.command';
import { TimelineMapper } from './drizzle.mapper';
import type { TimelineAggregate } from '../domain/timeline.ag';
import { eq, inArray } from 'drizzle-orm';
import { courses, students, timelines } from '$lib/server/db/schema';

export class DrizzleTimelineRepoCommand implements ITimelineRepoCommand {
	private _tx: PostgresJsDatabase<typeof schema>;
	constructor(tx: PostgresJsDatabase<typeof schema>) {
		this._tx = tx;
	}

	async findById(id: string): Promise<TimelineAggregate | null> {
		// 1. 先查 timeline row
		const [timeline] = await this._tx.select().from(timelines).where(eq(timelines.id, id));
		if (!timeline) return null;

		// 2. 查 course rows (timelineId = id)
		const courseRows = await this._tx.select().from(courses).where(eq(courses.timelineId, id));
		const courseIds = courseRows.map((c) => c.id);

		// 3. 查 student rows (courseId in courseIds)
		const studentRows =
			courseIds.length > 0
				? await this._tx.select().from(students).where(inArray(students.courseId, courseIds))
				: [];

		// 4. 用 mapper 組裝 aggregate
		return TimelineMapper.toTimelines(timeline, courseRows, studentRows);
	}
	async save(aggregate: TimelineAggregate): Promise<void> {
		const {
			timeline,
			courses: _courses,
			students: _students
		} = TimelineMapper.toPersistence(aggregate);

		// 1. timeline
		await this._tx.insert(timelines).values(timeline).onConflictDoNothing().returning();

		// 2. courses
		if (_courses.length > 0) {
			await this._tx.insert(courses).values(_courses).onConflictDoNothing().returning();
		}

		// 3. students
		if (_students.length > 0) {
			await this._tx.insert(students).values(_students).onConflictDoNothing().returning();
		}
	}
	async delete(id: string): Promise<void> {
		// 1. 刪 students (courseId in (select id from courses where timelineId = id))
		const courseRows = await this._tx.select().from(courses).where(eq(courses.timelineId, id));
		const courseIds = courseRows.map((c) => c.id);
		if (courseIds.length > 0) {
			await this._tx.delete(students).where(inArray(students.courseId, courseIds));
		}

		// 2. 刪 courses (timelineId = id)
		await this._tx.delete(courses).where(eq(courses.timelineId, id));

		// 3. 刪 timeline (id = id)
		await this._tx.delete(timelines).where(eq(timelines.id, id));
	}
}
