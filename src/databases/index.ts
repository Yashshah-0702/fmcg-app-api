import { MONGO_URL } from '@config';

export const dbConnection = {
  url: `${MONGO_URL}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
