import dotenv from "dotenv"

const envConfig = dotenv.config();

const {parsed: envs} = envConfig;

export default envs!;