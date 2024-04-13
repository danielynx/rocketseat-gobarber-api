import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listUserAppointmentsService: ListUserAppointmentsService;

describe('ListUserAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listUserAppointmentsService = new ListUserAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all appointments on a specific user', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user-1',
      date: new Date(2019, 4, 19, 14, 0, 0),
    });

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user-2',
      date: new Date(2019, 4, 20, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user-2',
      date: new Date(2019, 4, 20, 15, 0, 0),
    });

    const appointments = await listUserAppointmentsService.execute({
      user_id: 'user-2',
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
