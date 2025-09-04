import type { EnrollmentEntity } from './enrollment.en';

export interface IEnrollmentRepositoryCommand {
  findById(id: string): Promise<EnrollmentEntity | null>;
  delete(id: string): Promise<void>;
  save(enrollment: EnrollmentEntity): Promise<void>;
}
