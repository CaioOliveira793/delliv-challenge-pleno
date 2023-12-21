export type EntityID = string;

/**
 * Base entity class
 */
export abstract class Entity<T> {
	public readonly id: EntityID;
	protected state: T;

	protected constructor(id: EntityID, state: T) {
		this.id = id;
		this.state = state;
	}

	public internalState(): T {
		return structuredClone(this.state);
	}
}
