import { PrismaService } from '../prisma.service';
export declare class ProjectsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(organizationId?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        region: import("@prisma/client").$Enums.Region;
        organizationId: string;
        currency: string;
        locale: string;
    }[]>;
    create(dto: {
        organizationId: string;
        name: string;
        region: 'PT' | 'EU' | 'UK';
        currency?: string;
        locale?: string;
    }): import("@prisma/client").Prisma.Prisma__ProjectClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        region: import("@prisma/client").$Enums.Region;
        organizationId: string;
        currency: string;
        locale: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get(id: string): import("@prisma/client").Prisma.Prisma__ProjectClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        region: import("@prisma/client").$Enums.Region;
        organizationId: string;
        currency: string;
        locale: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    summary(projectId: string, from?: string, to?: string): Promise<{
        projectId: string;
        period: {
            from: Date | null;
            to: Date | null;
        };
        totals: {
            co2e: number;
            byScope: Record<"SCOPE2" | "SCOPE1" | "SCOPE3", number>;
        };
    }>;
    exportCsv(projectId: string): Promise<{
        filename: string;
        content: string;
    }>;
    exportJson(projectId: string): Promise<{
        id: string;
        activityId: string;
        type: string;
        amount: number;
        unit: string;
        factor_code: string | null;
        scope: import("@prisma/client").$Enums.Scope | null;
        co2e: number;
        created_at: Date;
    }[]>;
    calculateAll(projectId: string): Promise<{
        count: number;
    }>;
    calculateBulk(projectId: string, activityIds: string[]): Promise<{
        count: number;
    }>;
    results(projectId: string, from?: string, to?: string): Promise<{
        total: number;
        byScope: Record<"SCOPE2" | "SCOPE1" | "SCOPE3", number>;
        byType: Record<string, number>;
        byMonth: Record<string, number>;
    }>;
    computeSpend(projectId: string): Promise<{
        created: number;
        notice?: undefined;
    } | {
        notice: string;
        created?: undefined;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        region: import("@prisma/client").$Enums.Region;
        organizationId: string;
        currency: string;
        locale: string;
    }>;
}
