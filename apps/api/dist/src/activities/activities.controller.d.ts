import { ActivitiesService } from './activities.service';
export declare class ActivitiesController {
    private readonly activities;
    constructor(activities: ActivitiesService);
    list(projectId?: string): import("@prisma/client").Prisma.PrismaPromise<({
        factor: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        type: string;
        factorId: string | null;
        projectId: string;
        amount: number;
        location: string | null;
        periodFrom: Date | null;
        periodTo: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    create(dto: {
        projectId: string;
        type: string;
        amount: number;
        unit: string;
        location?: string;
        periodFrom?: string;
        periodTo?: string;
        factorId?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        type: string;
        factorId: string | null;
        projectId: string;
        amount: number;
        location: string | null;
        periodFrom: Date | null;
        periodTo: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, dto: {
        type?: string;
        amount?: number;
        unit?: string;
        factorId?: string;
    }): import("@prisma/client").Prisma.Prisma__ActivityClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        type: string;
        factorId: string | null;
        projectId: string;
        amount: number;
        location: string | null;
        periodFrom: Date | null;
        periodTo: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get(id: string): import("@prisma/client").Prisma.Prisma__ActivityClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        type: string;
        factorId: string | null;
        projectId: string;
        amount: number;
        location: string | null;
        periodFrom: Date | null;
        periodTo: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    duplicate(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        type: string;
        factorId: string | null;
        projectId: string;
        amount: number;
        location: string | null;
        periodFrom: Date | null;
        periodTo: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        unit: string;
        type: string;
        factorId: string | null;
        projectId: string;
        amount: number;
        location: string | null;
        periodFrom: Date | null;
        periodTo: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
