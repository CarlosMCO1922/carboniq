import {ProjectsService} from './projects.service';

describe('ProjectsService.results', () => {
  it('aggregates totals by scope, type and month', async () => {
    const prisma: any = {
      calculation: {
        findMany: jest.fn().mockResolvedValue([
          {co2e: 10, createdAt: new Date('2024-01-15'), activity: {type: 'electricity'}, factor: {scope: 'SCOPE2'}},
          {co2e: 5, createdAt: new Date('2024-01-20'), activity: {type: 'electricity'}, factor: {scope: 'SCOPE2'}},
          {co2e: 3, createdAt: new Date('2024-02-01'), activity: {type: 'diesel'}, factor: {scope: 'SCOPE1'}},
        ])
      }
    };
    const svc = new ProjectsService(prisma);
    const res = await svc.results('p1');
    expect(res.total).toBeCloseTo(18);
    expect(res.byScope.SCOPE2).toBeCloseTo(15);
    expect(res.byScope.SCOPE1).toBeCloseTo(3);
    expect(res.byType.electricity).toBeCloseTo(15);
    expect(res.byMonth['2024-01']).toBeCloseTo(15);
    expect(res.byMonth['2024-02']).toBeCloseTo(3);
  });
});
