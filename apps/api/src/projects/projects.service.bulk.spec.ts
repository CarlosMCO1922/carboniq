import {ProjectsService} from './projects.service';

describe('ProjectsService.calculateBulk', () => {
  it('creates calculations for given activity ids', async () => {
    const activities = [
      {id:'a1', projectId:'p1', amount:100, factorId:'f1'},
      {id:'a2', projectId:'p1', amount:50, factorId:null}
    ];
    const prisma: any = {
      activity: { findMany: jest.fn().mockResolvedValue(activities) },
      emissionFactor: { findUnique: jest.fn().mockResolvedValue({id:'f1', co2ePerUnit:0.2}) },
      calculation: { create: jest.fn() }
    };
    const svc = new ProjectsService(prisma);
    const res = await svc.calculateBulk('p1', ['a1','a2']);
    expect(res.count).toBe(2);
    expect(prisma.calculation.create).toHaveBeenCalledTimes(2);
  });
});
