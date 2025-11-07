import { FactorsService } from './factors.service';
export declare class FactorsController {
    private readonly factors;
    constructor(factors: FactorsService);
    list(region?: 'PT' | 'EU' | 'UK', scope?: 'SCOPE1' | 'SCOPE2' | 'SCOPE3'): import("@prisma/client").Prisma.PrismaPromise<{
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
    search(q?: string, region?: 'PT' | 'EU' | 'UK', scope?: 'SCOPE1' | 'SCOPE2' | 'SCOPE3', unit?: string, version?: string, limit?: string): import("@prisma/client").Prisma.PrismaPromise<{
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
    suggest(region: 'PT' | 'EU' | 'UK', type: string): Promise<{
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
