import Sequelize from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://postgres:JaFUPTmlpu31IC7mKh8f@containers-us-west-35.railway.app:6613/railway');