import { PrismaService } from '../prisma.service';
export declare class SpendService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listMappings(projectId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        factorId: string;
        projectId: string;
        description: string | null;
    }[]>;
    upsertMapping(dto: {
        projectId: string;
        code: string;
        factorId: string;
        description?: string;
    }): import("@prisma/client").Prisma.Prisma__SpendMappingClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        factorId: string;
        projectId: string;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    importCsv(projectId: string, csv: string): Promise<{
        count: number;
    }>;
    compute(projectId: string): Promise<{
        created: number;
    }>;
}
