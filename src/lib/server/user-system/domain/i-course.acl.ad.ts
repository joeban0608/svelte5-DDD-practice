export interface ICourseAntiCorruptionLayerAdapter {
	roleToPermission(roleTypes: string): Promise<string>;
}

