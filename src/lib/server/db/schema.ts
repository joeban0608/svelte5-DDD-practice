import { pgTable, integer, text, timestamp, bigint } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const timelines = pgTable('timelines', {
	id: text('id').primaryKey(),
	day: integer('day').notNull(),
	period: integer('period').notNull(),
	createdAt: bigint('created_at', { mode: 'number' }).notNull()
});

export const courses = pgTable('courses', {
	id: text('id').primaryKey(),
	timelineId: text('timeline_id')
		.references(() => timelines.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	studentCountMin: integer('student_count_min').notNull(),
	studentCountMax: integer('student_count_max').notNull(),
	createdAt: bigint('created_at', { mode: 'number' }).notNull()
});

export const students = pgTable('students', {
	id: text('id').primaryKey(),
	courseId: text('course_id')
		.references(() => courses.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.notNull(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	createdAt: integer('created_at').notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
