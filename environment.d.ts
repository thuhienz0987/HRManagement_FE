declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CEO: string;
            HRManager: string;
            DepartmentManager: string;
            TeamManager: string;
            Employee: string;
        }
    }
}
export {};
