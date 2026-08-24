import app from './app.js';
import { sequelize } from './config/database.js';
import { env } from './config/env.js';
import { User, SiteSetting } from './models/index.js';
import { hashPassword } from './utils/auth.js';
import { seedAcademyData } from './seeders/academy.seed.js';

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: env.nodeEnv !== 'production' });
    await seedAcademyData();

    const existingAdmin = await User.findOne({ where: { email: env.admin.email.toLowerCase() } });
    if (!existingAdmin) {
      await User.create({ name: env.admin.name, email: env.admin.email.toLowerCase(), passwordHash: await hashPassword(env.admin.password), role: 'admin' });
      console.log(`Admin created: ${env.admin.email}`);
    }

    await SiteSetting.findOrCreate({ where: { id: 1 }, defaults: { teacherName: env.admin.name, headline: 'Chemistry & Science made simple.' } });

    app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
