import type { IWebsiteCommandRepository } from './i-website.cr';
import type { IWebsiteQueryRepository } from './i-website.qr';

export interface IGenesisEngineTransaction {
	genesisRepo: IWebsiteCommandRepository;
}

export interface IGenesisEngineUnitOfWork {
	readonly genesisRepo: IWebsiteQueryRepository;

	execute<T>(callback: (transaction: IGenesisEngineTransaction) => Promise<T>): Promise<T>;
}
