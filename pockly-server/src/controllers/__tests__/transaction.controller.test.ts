import request from 'supertest';
import express from 'express';
import transactionRoutes from '../../routes/transaction.routes';

const app = express();
app.use(express.json());
app.use('/api/transactions', transactionRoutes);

describe('Transaction Controller', () => {
  it('GET /api/transactions should return 200 and a message', async () => {
    const response = await request(app).get('/api/transactions');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Get transactions endpoint' });
  });

  it('POST /api/transactions should return 201 and a message', async () => {
    const response = await request(app).post('/api/transactions').send({
      type: 'expense',
      amount: 100,
      categoryId: 'food',
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Create transaction endpoint' });
  });

  it('PUT /api/transactions/:id should return 200 and a message', async () => {
    const response = await request(app).put('/api/transactions/123').send({
      amount: 200,
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Update transaction 123' });
  });

  it('DELETE /api/transactions/:id should return 200 and a message', async () => {
    const response = await request(app).delete('/api/transactions/123');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Delete transaction 123' });
  });
});
