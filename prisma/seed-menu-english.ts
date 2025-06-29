import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌐 Adding English translations for all menus...');

  // Get admin user for created_by fields
  const adminUser = await prisma.sys_user.findFirst({
    where: { email: 'admin@jairak.com' }
  });

  if (!adminUser) {
    console.error('❌ Admin user not found. Please run the main seed first.');
    return;
  }

  // Get all menus
  const allMenus = await prisma.sys_menu.findMany({
    orderBy: { sort_order: 'asc' }
  });

  console.log(`📋 Found ${allMenus.length} menus to add English translations`);

  // Menu English translations mapping
  const menuTranslations = [
    // Main menus
    { slug: 'dashboard', name: 'Dashboard', description: 'Main dashboard page' },
    { slug: 'user-management', name: 'User Management', description: 'Manage users and permissions' },
    { slug: 'users', name: 'Users', description: 'User list and management' },
    { slug: 'roles', name: 'Roles', description: 'Role and permission management' },
    { slug: 'content-management', name: 'Content Management', description: 'Manage website content' },
    { slug: 'categories', name: 'Categories', description: 'Content categories' },
    { slug: 'contents', name: 'Contents', description: 'Content articles and pages' },
    { slug: 'system', name: 'System', description: 'System configuration' },
    { slug: 'settings', name: 'Settings', description: 'System settings' },
    { slug: 'labels', name: 'Labels', description: 'UI labels and translations' },
    { slug: 'notifications', name: 'Notifications', description: 'System notifications' },
    { slug: 'audit-logs', name: 'Audit Logs', description: 'System audit trail' },
    { slug: 'reports', name: 'Reports', description: 'System reports and analytics' },
    { slug: 'sales-report', name: 'Sales Report', description: 'Sales analytics and reports' },
    { slug: 'user-report', name: 'User Report', description: 'User activity reports' },
  ];

  // Create English translations for all menus
  for (const menu of allMenus) {
    const translation = menuTranslations.find(t => t.slug === menu.slug);
    
    if (translation) {
      await prisma.sys_menu_translation.upsert({
        where: {
          menu_id_language_code: {
            menu_id: menu.id,
            language_code: 'en',
          },
        },
        update: {
          name: translation.name,
          description: translation.description,
          updated_by: adminUser.id,
          updated_by_name: 'System Administrator',
        },
        create: {
          menu_id: menu.id,
          language_code: 'en',
          name: translation.name,
          description: translation.description,
          created_by: adminUser.id,
          created_by_name: 'System Administrator',
        },
      });
      console.log(`✅ Added English translation for: ${menu.slug}`);
    } else {
      // If no specific translation found, use the menu name as is
      await prisma.sys_menu_translation.upsert({
        where: {
          menu_id_language_code: {
            menu_id: menu.id,
            language_code: 'en',
          },
        },
        update: {
          name: menu.name,
          description: `${menu.name} menu`,
          updated_by: adminUser.id,
          updated_by_name: 'System Administrator',
        },
        create: {
          menu_id: menu.id,
          language_code: 'en',
          name: menu.name,
          description: `${menu.name} menu`,
          created_by: adminUser.id,
          created_by_name: 'System Administrator',
        },
      });
      console.log(`✅ Added English translation for: ${menu.slug} (using default name)`);
    }
  }

  // Verify translations
  const menuCount = await prisma.sys_menu.count();
  const englishTranslations = await prisma.sys_menu_translation.count({
    where: { language_code: 'en' }
  });
  const thaiTranslations = await prisma.sys_menu_translation.count({
    where: { language_code: 'th' }
  });

  console.log('\n📊 Summary:');
  console.log(`- Total menus: ${menuCount}`);
  console.log(`- English translations: ${englishTranslations}`);
  console.log(`- Thai translations: ${thaiTranslations}`);

  // Show sample data
  console.log('\n📋 Sample menu with translations:');
  const sampleMenu = await prisma.sys_menu.findFirst({
    where: { slug: 'dashboard' },
    include: {
      translations: true
    }
  });

  if (sampleMenu) {
    console.log(`Menu: ${sampleMenu.name} (${sampleMenu.slug})`);
    sampleMenu.translations.forEach(trans => {
      console.log(`  - ${trans.language_code}: ${trans.name}`);
    });
  }

  console.log('\n✅ English menu translations added successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error adding English menu translations:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
