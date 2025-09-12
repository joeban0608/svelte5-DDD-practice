import type { CourseAggregate } from "./course.ag";

export interface ICourseQueryRepository {
  findById(id: string): Promise<CourseAggregate | null>;
  list(): Promise<CourseAggregate[]>;
  findOne(): Promise<CourseAggregate | null>;
}