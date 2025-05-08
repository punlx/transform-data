import express, { Request, Response } from 'express';
import axios from 'axios';
import { transformUsersToDepartment } from './transformation';
import { User } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

const DUMMY_USERS_API = 'https://dummyjson.com/users';

app.get('/transformed', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(DUMMY_USERS_API);
    const users: User[] = response.data.users;

    const result = transformUsersToDepartment(users);

    return res.json(result);
  } catch (error: any) {
    console.error('Error fetching users:', error.message);
    return res.status(500).json({ error: 'Failed to fetch or transform users' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
