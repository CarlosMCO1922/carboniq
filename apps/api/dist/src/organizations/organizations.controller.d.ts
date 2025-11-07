import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private readonly orgs;
    constructor(orgs: OrganizationsService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.OrgType;
    }[]>;
    create(dto: {
        name: string;
        type: 'B2C' | 'B2B';
    }): import("@prisma/client").Prisma.Prisma__OrganizationClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.OrgType;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    get(id: string): import("@prisma/client").Prisma.Prisma__OrganizationClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.OrgType;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
