import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.REACT_APP_POSTGRES_URL!);

export default sql; 