import {SpendService} from './spend.service';

function mkPrisma() {
  const created: any[] = [];
  return {
    created,
    expense: {
      create: jest.fn(async ({data}: any) => { created.push(data); return data; })
    },
    spendMapping: { findMany: jest.fn().mockResolvedValue([]) }
  } as any;
}

describe('SpendService.importCsv', () => {
  it('parses CSV and creates expenses', async () => {
    const prisma: any = mkPrisma();
    const svc = new SpendService(prisma);
    const csv = 'date,amount,currency,category\n2024-01-01,100,EUR,OFFICE\n2024-02-01,50,EUR,TRAVEL\n';
    const res = await svc.importCsv('p1', csv);
    expect(res.count).toBe(2);
    expect(prisma.expense.create).toHaveBeenCalledTimes(2);
  });
});
