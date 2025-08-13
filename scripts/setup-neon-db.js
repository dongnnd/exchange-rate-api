#!/usr/bin/env node

const sequelize = require('../src/config/database');
const logger = require('../src/config/logger');
const { User, Currency, ExchangeRate } = require('../src/models/sequelize');

async function setupNeonDatabase() {
  try {
    logger.info('🚀 Bắt đầu setup Neon database...');

    // Test kết nối
    logger.info('📡 Đang test kết nối Neon...');
    await sequelize.authenticate();
    logger.info('✅ Kết nối Neon thành công!');

    // Khởi tạo schema
    logger.info('🏗️  Đang tạo schema...');
    await sequelize.sync({ force: true });
    logger.info('✅ Schema đã được tạo!');

    // Tạo admin user
    logger.info('👤 Đang tạo admin user...');
    const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
        isEmailVerified: true,
      });
      logger.info('✅ Admin user đã được tạo!');
    } else {
      logger.info('ℹ️  Admin user đã tồn tại.');
    }

    // Seed dữ liệu currencies
    logger.info('🌱 Đang seed dữ liệu currencies...');
    const seedCurrencies = require('../src/scripts/seed-currencies');
    await seedCurrencies();
    logger.info('✅ Dữ liệu currencies đã được seed!');

    logger.info('🎉 Setup Neon database hoàn tất!');
  } catch (error) {
    logger.error('❌ Lỗi setup database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    logger.info('🔌 Đã đóng kết nối database.');
  }
}

// Chạy script
setupNeonDatabase();
