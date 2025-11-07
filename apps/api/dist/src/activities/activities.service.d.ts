import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
export declare class ActivitiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(projectId?: string): Prisma.PrismaPromise<({
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
        metadata: Prisma.JsonValue | null;
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
        metadata: Prisma.JsonValue | null;
    }>;
    get(id: string): Prisma.Prisma__ActivityClient<{
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
        metadata: Prisma.JsonValue | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, dto: {
        type?: string;
        amount?: number;
        unit?: string;
        factorId?: string;
    }): Prisma.Prisma__ActivityClient<{
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
        metadata: Prisma.JsonValue | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
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
        metadata: Prisma.JsonValue | null;
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
        metadata: Prisma.JsonValue | null;
    }>;
}
