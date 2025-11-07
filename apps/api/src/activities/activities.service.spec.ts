import {ActivitiesService} from './activities.service';

describe('ActivitiesService.create', () => {
  it('casts metadata to Prisma JSON and converts dates', async () => {
    const create = jest.fn().mockResolvedValue({id:'a1'});
    const prisma: any = { activity: { create } };
    const svc = new ActivitiesService(prisma);
    await svc.create({
      projectId: 'p1', type: 'electricity', amount: 100, unit: 'kWh',
      periodFrom: '2024-01-01', periodTo: '2024-02-01',
      metadata: { note: 'test' }
    } as any);
    const arg = create.mock.calls[0][0].data;
    expect(arg.projectId).toBe('p1');
    expect(arg.periodFrom).toBeInstanceOf(Date);
    expect(arg.periodTo).toBeInstanceOf(Date);
    expect(arg.metadata).toBeDefined();
  });
});