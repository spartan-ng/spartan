export interface MigrateHelmLibrariesGeneratorSchema {
	directory?: string;
	rootProject?: boolean;
	tags?: string;
	angularCli?: boolean;
	multiLibs: boolean;
	buildable: boolean;
}
