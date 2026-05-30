//Das hier intercepted die Firebase/API calls während tests
import { rest } from 'msw';
export const handlers = [
    //Mock Firebase Auth endpoint
    rest.post('/auth/login', (req, res, ctx) => {
        return res(ctx.json({ user: { uid: '123', email: 'test@test.com' } }));
  }),
  
  // Man kann mehr mocks hinzufügen wenn nötig
];