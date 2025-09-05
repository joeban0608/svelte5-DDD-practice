import { DomainEvents } from '$lib/server/_shared/domain/a-aggregate-root.ag';
import { drizzleClient, type TransactionScope } from './drizzle.cl';

export class DrizzleUnitOfWork {
	public static async execute<T>(impl: (tx: TransactionScope) => Promise<T>): Promise<T> {
		try {
			const result = await drizzleClient.transaction(async (tx) => {
				return await impl(tx);
			});
			DomainEvents.dispatchAllEvent();
			return result;
		} catch (error) {
			console.error('Unit of Work transaction failed:', error);
			throw error;
		} finally {
			DomainEvents.clearMarked();
		}
	}
}
