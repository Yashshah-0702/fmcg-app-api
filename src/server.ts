import App from '@/app';
// import AuthRoute from '@routes/auth.route';
// import IndexRoute from '@routes/index.route';
// import UsersRoute from '@routes/users.route';
import Routes from './routes';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App(Routes);

app.listen();
