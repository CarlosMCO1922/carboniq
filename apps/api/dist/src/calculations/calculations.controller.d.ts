import { CalculationsService } from './calculations.service';
export declare class CalculationsController {
    private readonly calc;
    constructor(calc: CalculationsService);
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
