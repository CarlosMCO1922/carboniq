import type { Request } from 'express';
import { SpendService } from './spend.service';
export declare class SpendController {
    private readonly spend;
    constructor(spend: SpendService);
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
    importCsv(projectId: string, req: Request): Promise<{
        count: number;
    }>;
    compute(dto: {
        projectId: string;
    }): Promise<{
        created: number;
    }>;
}
