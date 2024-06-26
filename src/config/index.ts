import { config } from 'dotenv';
config({ path: '.env' });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { PORT, MONGO_URL ,JWT_SECRET , TOKEN_EXPIRY , RESET_PASSWORD_SECRET , RESET_PASSWORD_TOKEN_EXPIRATION , LOG_FORMAT , LOG_DIR , ORIGIN , MAIN_UPLOAD_DIR , IMAGE_PATH ,SERVICE,EMAIL,PASSWORD } = process.env;
