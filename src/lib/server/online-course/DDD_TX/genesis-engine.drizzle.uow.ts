import { DrizzleUnitOfWork } from '$lib/server/_shared/infrastructure/persistence/drizzle.uow';
import type {
	IGenesisEngineTransaction,
	IGenesisEngineUnitOfWork
} from '../domain/i-genesis-engine.uow';
import type { IWebsiteQueryRepository } from '../domain/i-website.qr';
import { WebsiteDrizzleCommandRepository } from './website.drizzle.cr';
import { WebsiteDrizzleQueryRepository } from './website.drizzle.qr';

export class GenesisEngineDrizzleUnitOfWork implements IGenesisEngineUnitOfWork {
	public readonly genesisRepo: IWebsiteQueryRepository;

	constructor() {
		this.genesisRepo = new WebsiteDrizzleQueryRepository();
	}

	public async execute<T>(
		callback: (transaction: IGenesisEngineTransaction) => Promise<T>
	): Promise<T> {
		return await DrizzleUnitOfWork.execute(async (tx) => {
			return await callback({
				genesisRepo: new WebsiteDrizzleCommandRepository(tx)
			});
		});
	}
}
