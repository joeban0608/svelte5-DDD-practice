import type { EnrollmentEntity } from "../domain/enrollment.en";
import type { IEnrollmentRepositoryCommand } from "../domain/i-enrollment.repo.command";

export class MockEnrollmentRepositoryCommand implements IEnrollmentRepositoryCommand {
  constructor(private readonly _repo: Map<string, EnrollmentEntity>) {}

  async findById(id: string): Promise<EnrollmentEntity | null> {
    return this._repo.get(id) || null;
  }

  async delete(id: string): Promise<void> {
    this._repo.delete(id);
  }

  async save(enrollment: EnrollmentEntity): Promise<void> {
    this._repo.set(enrollment.props.id.value, enrollment);
  }
}