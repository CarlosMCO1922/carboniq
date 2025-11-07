import { PrismaService } from '../prisma.service';
export declare class FactorsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(params: {
        region?: 'PT' | 'EU' | 'UK';
        scope?: 'SCOPE1' | 'SCOPE2' | 'SCOPE3';
    }): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        region: import("@prisma/client").$Enums.Region;
        scope: import("@prisma/client").$Enums.Scope;
        source: string;
        unit: string;
        co2ePerUnit: number;
        version: string;
        validFrom: Date | null;
        validTo: Date | null;
    }[]>;
    search(params: {
        q?: string;
        region?: 'PT' | 'EU' | 'UK';
        scope?: 'SCOPE1' | 'SCOPE2' | 'SCOPE3';
        unit?: string;
        version?: string;
        limit?: number;
    }): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        region: import("@prisma/client").$Enums.Region;
        scope: import("@prisma/client").$Enums.Scope;
        source: string;
        unit: string;
        co2ePerUnit: number;
        version: string;
        validFrom: Date | null;
        validTo: Date | null;
    }[]>;
    suggest(params: {
        region: 'PT' | 'EU' | 'UK';
        type: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        region: import("@prisma/client").$Enums.Region;
        scope: import("@prisma/client").$Enums.Scope;
        source: string;
        unit: string;
        co2ePerUnit: number;
        version: string;
        validFrom: Date | null;
        validTo: Date | null;
    } | null>;
}
