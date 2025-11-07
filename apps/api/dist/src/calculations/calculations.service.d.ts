import { PrismaService } from '../prisma.service';
export declare class CalculationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    compute(dto: {
        activityId: string;
        method?: string;
        factorId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        activityId: string;
        factorId: string | null;
        method: string;
        co2e: number;
        breakdown: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
