import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create system settings
  console.log('📋 Creating system settings...');
  await prisma.sys_setting.createMany({
    data: [
      {
        key: 'system_name',
        value: 'Jairak Demo API',
        description: 'System name displayed in the application',
        created_by_name: 'System',
      },
      {
        key: 'login_mode',
        value: 'both',
        description: 'Login mode: local, azure, or both',
        created_by_name: 'System',
      },
      {
        key: 'default_language',
        value: 'en',
        description: 'Default system language',
        created_by_name: 'System',
      },
      {
        key: 'max_login_attempts',
        value: '5',
        description: 'Maximum login attempts before account lockout',
        created_by_name: 'System',
      },
      {
        key: 'session_timeout',
        value: '30',
        description: 'Session timeout in minutes',
        created_by_name: 'System',
      },
      {
        key: 'password_min_length',
        value: '8',
        description: 'Minimum password length',
        created_by_name: 'System',
      },
    ],
    skipDuplicates: true,
  });

  // Create roles
  console.log('👥 Creating roles...');
  const adminRole = await prisma.sys_role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'Full system access',
      created_by_name: 'System',
    },
  });

  const editorRole = await prisma.sys_role.upsert({
    where: { name: 'Editor' },
    update: {},
    create: {
      name: 'Editor',
      description: 'Content management access',
      created_by_name: 'System',
    },
  });

  const userRole = await prisma.sys_role.upsert({
    where: { name: 'User' },
    update: {},
    create: {
      name: 'User',
      description: 'Basic user access',
      created_by_name: 'System',
    },
  });

  // Create menus
  console.log('📁 Creating menu structure...');
  const dashboardMenu = await prisma.sys_menu.upsert({
    where: { slug: 'dashboard' },
    update: {},
    create: {
      name: 'Dashboard',
      slug: 'dashboard',
      icon: 'dashboard',
      url: '/dashboard',
      sort_order: 1,
      created_by_name: 'System',
    },
  });

  const userManagementMenu = await prisma.sys_menu.upsert({
    where: { slug: 'user-management' },
    update: {},
    create: {
      name: 'User Management',
      slug: 'user-management',
      icon: 'users',
      sort_order: 2,
      created_by_name: 'System',
    },
  });

  const usersMenu = await prisma.sys_menu.upsert({
    where: { slug: 'users' },
    update: {},
    create: {
      name: 'Users',
      slug: 'users',
      icon: 'user',
      url: '/users',
      parent_id: userManagementMenu.id,
      sort_order: 1,
      created_by_name: 'System',
    },
  });

  const rolesMenu = await prisma.sys_menu.upsert({
    where: { slug: 'roles' },
    update: {},
    create: {
      name: 'Roles',
      slug: 'roles',
      icon: 'shield',
      url: '/roles',
      parent_id: userManagementMenu.id,
      sort_order: 2,
      created_by_name: 'System',
    },
  });

  const contentManagementMenu = await prisma.sys_menu.upsert({
    where: { slug: 'content-management' },
    update: {},
    create: {
      name: 'Content Management',
      slug: 'content-management',
      icon: 'file-text',
      sort_order: 3,
      created_by_name: 'System',
    },
  });

  const categoriesMenu = await prisma.sys_menu.upsert({
    where: { slug: 'categories' },
    update: {},
    create: {
      name: 'Categories',
      slug: 'categories',
      icon: 'folder',
      url: '/categories',
      parent_id: contentManagementMenu.id,
      sort_order: 1,
      created_by_name: 'System',
    },
  });

  const contentsMenu = await prisma.sys_menu.upsert({
    where: { slug: 'contents' },
    update: {},
    create: {
      name: 'Contents',
      slug: 'contents',
      icon: 'file',
      url: '/contents',
      parent_id: contentManagementMenu.id,
      sort_order: 2,
      created_by_name: 'System',
    },
  });

  const systemMenu = await prisma.sys_menu.upsert({
    where: { slug: 'system' },
    update: {},
    create: {
      name: 'System',
      slug: 'system',
      icon: 'settings',
      sort_order: 4,
      created_by_name: 'System',
    },
  });

  const settingsMenu = await prisma.sys_menu.upsert({
    where: { slug: 'settings' },
    update: {},
    create: {
      name: 'Settings',
      slug: 'settings',
      icon: 'cog',
      url: '/settings',
      parent_id: systemMenu.id,
      sort_order: 1,
      created_by_name: 'System',
    },
  });

  const labelsMenu = await prisma.sys_menu.upsert({
    where: { slug: 'labels' },
    update: {},
    create: {
      name: 'Labels',
      slug: 'labels',
      icon: 'tag',
      url: '/labels',
      parent_id: systemMenu.id,
      sort_order: 2,
      created_by_name: 'System',
    },
  });

  const notificationsMenu = await prisma.sys_menu.upsert({
    where: { slug: 'notifications' },
    update: {},
    create: {
      name: 'Notifications',
      slug: 'notifications',
      icon: 'bell',
      url: '/notifications',
      parent_id: systemMenu.id,
      sort_order: 3,
      created_by_name: 'System',
    },
  });

  const auditMenu = await prisma.sys_menu.upsert({
    where: { slug: 'audit-logs' },
    update: {},
    create: {
      name: 'Audit Logs',
      slug: 'audit-logs',
      icon: 'list',
      url: '/audit-logs',
      parent_id: systemMenu.id,
      sort_order: 4,
      created_by_name: 'System',
    },
  });

  // Create menu translations
  console.log('🌐 Creating menu translations...');
  const menuTranslations = [
    { menu: dashboardMenu, lang: 'th', name: 'แดชบอร์ด' },
    { menu: userManagementMenu, lang: 'th', name: 'จัดการผู้ใช้' },
    { menu: usersMenu, lang: 'th', name: 'ผู้ใช้' },
    { menu: rolesMenu, lang: 'th', name: 'บทบาท' },
    { menu: contentManagementMenu, lang: 'th', name: 'จัดการเนื้อหา' },
    { menu: categoriesMenu, lang: 'th', name: 'หมวดหมู่' },
    { menu: contentsMenu, lang: 'th', name: 'เนื้อหา' },
    { menu: systemMenu, lang: 'th', name: 'ระบบ' },
    { menu: settingsMenu, lang: 'th', name: 'ตั้งค่า' },
    { menu: labelsMenu, lang: 'th', name: 'ป้ายกำกับ' },
    { menu: notificationsMenu, lang: 'th', name: 'การแจ้งเตือน' },
    { menu: auditMenu, lang: 'th', name: 'บันทึกการใช้งาน' },
  ];

  for (const trans of menuTranslations) {
    await prisma.sys_menu_translation.upsert({
      where: {
        menu_id_language_code: {
          menu_id: trans.menu.id,
          language_code: trans.lang,
        },
      },
      update: {},
      create: {
        menu_id: trans.menu.id,
        language_code: trans.lang,
        name: trans.name,
        created_by_name: 'System',
      },
    });
  }

  // Create permissions
  console.log('🔐 Setting up permissions...');
  const allMenus = [
    dashboardMenu,
    usersMenu,
    rolesMenu,
    categoriesMenu,
    contentsMenu,
    settingsMenu,
    labelsMenu,
    notificationsMenu,
    auditMenu,
  ];

  // Admin - full access
  for (const menu of allMenus) {
    await prisma.sys_role_permission.upsert({
      where: {
        role_id_menu_id: {
          role_id: adminRole.id,
          menu_id: menu.id,
        },
      },
      update: {},
      create: {
        role_id: adminRole.id,
        menu_id: menu.id,
        can_view: true,
        can_create: true,
        can_update: true,
        can_delete: true,
        created_by_name: 'System',
      },
    });
  }

  // Editor - content management access
  const editorMenus = [dashboardMenu, categoriesMenu, contentsMenu, labelsMenu];
  for (const menu of editorMenus) {
    await prisma.sys_role_permission.upsert({
      where: {
        role_id_menu_id: {
          role_id: editorRole.id,
          menu_id: menu.id,
        },
      },
      update: {},
      create: {
        role_id: editorRole.id,
        menu_id: menu.id,
        can_view: true,
        can_create: menu.id !== dashboardMenu.id,
        can_update: menu.id !== dashboardMenu.id,
        can_delete: false,
        created_by_name: 'System',
      },
    });
  }

  // User - limited access
  const userMenus = [dashboardMenu, contentsMenu];
  for (const menu of userMenus) {
    await prisma.sys_role_permission.upsert({
      where: {
        role_id_menu_id: {
          role_id: userRole.id,
          menu_id: menu.id,
        },
      },
      update: {},
      create: {
        role_id: userRole.id,
        menu_id: menu.id,
        can_view: true,
        can_create: false,
        can_update: false,
        can_delete: false,
        created_by_name: 'System',
      },
    });
  }

  // Create users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.sys_user.upsert({
    where: { email: 'admin@jairak.com' },
    update: {},
    create: {
      email: 'admin@jairak.com',
      username: 'admin',
      password_hash: hashedPassword,
      first_name: 'System',
      last_name: 'Administrator',
      phone_number: '+66812345678',
      login_method: 'local',
      role_id: adminRole.id,
      created_by_name: 'System',
    },
  });

  const editorPassword = await bcrypt.hash('editor123', 10);
  const editorUser = await prisma.sys_user.upsert({
    where: { email: 'editor@jairak.com' },
    update: {},
    create: {
      email: 'editor@jairak.com',
      username: 'editor',
      password_hash: editorPassword,
      first_name: 'John',
      last_name: 'Editor',
      phone_number: '+66823456789',
      login_method: 'local',
      role_id: editorRole.id,
      created_by: adminUser.id,
      created_by_name: 'System Administrator',
    },
  });

  const userPassword = await bcrypt.hash('user123', 10);
  const normalUser = await prisma.sys_user.upsert({
    where: { email: 'user@jairak.com' },
    update: {},
    create: {
      email: 'user@jairak.com',
      username: 'user',
      password_hash: userPassword,
      first_name: 'Jane',
      last_name: 'User',
      phone_number: '+66834567890',
      login_method: 'local',
      role_id: userRole.id,
      created_by: adminUser.id,
      created_by_name: 'System Administrator',
    },
  });

  // Create Azure AD user
  const azureUser = await prisma.sys_user.upsert({
    where: { email: 'azure.user@jairak.com' },
    update: {},
    create: {
      email: 'azure.user@jairak.com',
      username: 'azureuser',
      first_name: 'Azure',
      last_name: 'User',
      login_method: 'azure',
      azure_id: 'azure-id-12345',
      role_id: userRole.id,
      created_by: adminUser.id,
      created_by_name: 'System Administrator',
    },
  });

  // Create content categories
  console.log('📂 Creating content categories...');
  const generalCategory = await prisma.mod_category.upsert({
    where: { slug: 'general' },
    update: {},
    create: {
      name: 'General',
      slug: 'general',
      description: 'General content category',
      sort_order: 1,
      created_by: adminUser.id,
      created_by_name: 'System Administrator',
    },
  });

  const newsCategory = await prisma.mod_category.upsert({
    where: { slug: 'news' },
    update: {},
    create: {
      name: 'News',
      slug: 'news',
      description: 'News and announcements',
      sort_order: 2,
      created_by: adminUser.id,
      created_by_name: 'System Administrator',
    },
  });

  const tutorialCategory = await prisma.mod_category.upsert({
    where: { slug: 'tutorials' },
    update: {},
    create: {
      name: 'Tutorials',
      slug: 'tutorials',
      description: 'Tutorial and how-to articles',
      sort_order: 3,
      created_by: adminUser.id,
      created_by_name: 'System Administrator',
    },
  });

  const faqCategory = await prisma.mod_category.upsert({
    where: { slug: 'faq' },
    update: {},
    create: {
      name: 'FAQ',
      slug: 'faq',
      description: 'Frequently asked questions',
      parent_id: generalCategory.id,
      sort_order: 1,
      created_by: adminUser.id,
      created_by_name: 'System Administrator',
    },
  });

  // Create category translations
  console.log('🌐 Creating category translations...');
  const categoryTranslations = [
    { category: generalCategory, lang: 'th', name: 'ทั่วไป', desc: 'หมวดหมู่เนื้อหาทั่วไป' },
    { category: newsCategory, lang: 'th', name: 'ข่าวสาร', desc: 'ข่าวและประกาศ' },
    { category: tutorialCategory, lang: 'th', name: 'บทเรียน', desc: 'บทความแนะนำและวิธีใช้งาน' },
    { category: faqCategory, lang: 'th', name: 'คำถามที่พบบ่อย', desc: 'คำถามที่พบบ่อย' },
  ];

  for (const trans of categoryTranslations) {
    await prisma.mod_category_translation.upsert({
      where: {
        category_id_language_code: {
          category_id: trans.category.id,
          language_code: trans.lang,
        },
      },
      update: {},
      create: {
        category_id: trans.category.id,
        language_code: trans.lang,
        name: trans.name,
        description: trans.desc,
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    });
  }

  // Create contents
  console.log('📝 Creating sample contents...');
  const contents = [
    {
      title: 'Welcome to Jairak Demo API',
      slug: 'welcome',
      content: `
# Welcome to Jairak Demo API

This is a comprehensive API system built with NestJS and Prisma.

## Features
- User authentication with JWT
- Role-based access control
- Content management system
- Multi-language support
- Audit logging
- And much more!

## Getting Started
Please refer to the documentation for more information.
      `,
      excerpt: 'Welcome message for the system',
      category_id: generalCategory.id,
      status: 'published' as const,
      created_by: adminUser.id,
      created_by_name: 'System Administrator',
    },
    {
      title: 'System Update v1.0.1',
      slug: 'system-update-101',
      content: `
# System Update v1.0.1

We're excited to announce the release of version 1.0.1!

## What's New
- Improved performance
- Bug fixes
- Enhanced security features
- New API endpoints

## Breaking Changes
None in this release.
      `,
      excerpt: 'Latest system update information',
      category_id: newsCategory.id,
      status: 'published' as const,
      created_by: editorUser.id,
      created_by_name: 'John Editor',
    },
    {
      title: 'How to Use the API',
      slug: 'how-to-use-api',
      content: `
# How to Use the API

This tutorial will guide you through using our API.

## Authentication
First, you need to authenticate using your credentials:

\`\`\`bash
POST /auth/login
{
  "email": "your-email@example.com",
  "password": "your-password"
}
\`\`\`

## Making Requests
Include the JWT token in your headers:

\`\`\`
Authorization: Bearer YOUR_JWT_TOKEN
\`\`\`
      `,
      excerpt: 'Step-by-step guide to using the API',
      category_id: tutorialCategory.id,
      status: 'published' as const,
      created_by: editorUser.id,
      created_by_name: 'John Editor',
    },
    {
      title: 'Draft Article',
      slug: 'draft-article',
      content: 'This is a draft article that is not yet published.',
      excerpt: 'Draft content',
      category_id: generalCategory.id,
      status: 'draft' as const,
      created_by: editorUser.id,
      created_by_name: 'John Editor',
    },
  ];

  for (const content of contents) {
    await prisma.mod_content.upsert({
      where: { slug: content.slug },
      update: {},
      create: content,
    });
  }

  // Create content translations
  console.log('🌐 Creating content translations...');
  const welcomeContent = await prisma.mod_content.findUnique({ where: { slug: 'welcome' } });
  if (welcomeContent) {
    await prisma.mod_content_translation.upsert({
      where: {
        content_id_language_code: {
          content_id: welcomeContent.id,
          language_code: 'th',
        },
      },
      update: {},
      create: {
        content_id: welcomeContent.id,
        language_code: 'th',
        title: 'ยินดีต้อนรับสู่ Jairak Demo API',
        content: `
# ยินดีต้อนรับสู่ Jairak Demo API

นี่คือระบบ API ที่ครอบคลุมสร้างด้วย NestJS และ Prisma

## คุณสมบัติ
- การยืนยันตัวตนผู้ใช้ด้วย JWT
- การควบคุมการเข้าถึงตามบทบาท
- ระบบจัดการเนื้อหา
- รองรับหลายภาษา
- บันทึกการตรวจสอบ
- และอื่นๆ อีกมากมาย!
        `,
        excerpt: 'ข้อความต้อนรับสำหรับระบบ',
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    });
  }

  // Create labels
  console.log('🏷️ Creating labels...');
  const labels = [
    // Common labels
    { key: 'common.save', default_value: 'Save', description: 'Save button label' },
    { key: 'common.cancel', default_value: 'Cancel', description: 'Cancel button label' },
    { key: 'common.delete', default_value: 'Delete', description: 'Delete button label' },
    { key: 'common.edit', default_value: 'Edit', description: 'Edit button label' },
    { key: 'common.view', default_value: 'View', description: 'View button label' },
    { key: 'common.create', default_value: 'Create', description: 'Create button label' },
    { key: 'common.search', default_value: 'Search', description: 'Search button label' },
    { key: 'common.export', default_value: 'Export', description: 'Export button label' },
    { key: 'common.import', default_value: 'Import', description: 'Import button label' },
    { key: 'common.refresh', default_value: 'Refresh', description: 'Refresh button label' },
    { key: 'common.submit', default_value: 'Submit', description: 'Submit button label' },
    { key: 'common.reset', default_value: 'Reset', description: 'Reset button label' },
    { key: 'common.back', default_value: 'Back', description: 'Back button label' },
    { key: 'common.next', default_value: 'Next', description: 'Next button label' },
    { key: 'common.previous', default_value: 'Previous', description: 'Previous button label' },
    { key: 'common.yes', default_value: 'Yes', description: 'Yes option' },
    { key: 'common.no', default_value: 'No', description: 'No option' },
    { key: 'common.loading', default_value: 'Loading...', description: 'Loading message' },
    
    // Auth labels
    { key: 'auth.login', default_value: 'Login', description: 'Login page title' },
    { key: 'auth.logout', default_value: 'Logout', description: 'Logout button label' },
    { key: 'auth.register', default_value: 'Register', description: 'Register page title' },
    { key: 'auth.forgot_password', default_value: 'Forgot Password', description: 'Forgot password link' },
    { key: 'auth.email', default_value: 'Email', description: 'Email field label' },
    { key: 'auth.password', default_value: 'Password', description: 'Password field label' },
    { key: 'auth.remember_me', default_value: 'Remember Me', description: 'Remember me checkbox' },
    
    // Navigation labels
    { key: 'nav.dashboard', default_value: 'Dashboard', description: 'Dashboard navigation' },
    { key: 'nav.users', default_value: 'Users', description: 'Users navigation' },
    { key: 'nav.content', default_value: 'Content', description: 'Content navigation' },
    { key: 'nav.settings', default_value: 'Settings', description: 'Settings navigation' },
    { key: 'nav.profile', default_value: 'Profile', description: 'Profile navigation' },
    
    // Messages
    { key: 'msg.success', default_value: 'Operation completed successfully', description: 'Success message' },
    { key: 'msg.error', default_value: 'An error occurred', description: 'Error message' },
    { key: 'msg.confirm_delete', default_value: 'Are you sure you want to delete this item?', description: 'Delete confirmation' },
    { key: 'msg.no_data', default_value: 'No data available', description: 'No data message' },
    
    // Validation messages
    { key: 'validation.required', default_value: 'This field is required', description: 'Required field validation' },
    { key: 'validation.email', default_value: 'Please enter a valid email', description: 'Email validation' },
    { key: 'validation.min_length', default_value: 'Minimum length is {min}', description: 'Minimum length validation' },
    { key: 'validation.max_length', default_value: 'Maximum length is {max}', description: 'Maximum length validation' },
  ];

  for (const label of labels) {
    await prisma.sys_label.upsert({
      where: { key: label.key },
      update: {},
      create: {
        key: label.key,
        default_value: label.default_value,
        description: label.description,
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    });
  }

  // Create label translations
  console.log('🌐 Creating label translations...');
  const labelTranslations = [
    // Common - Thai
    { key: 'common.save', lang: 'th', value: 'บันทึก' },
    { key: 'common.cancel', lang: 'th', value: 'ยกเลิก' },
    { key: 'common.delete', lang: 'th', value: 'ลบ' },
    { key: 'common.edit', lang: 'th', value: 'แก้ไข' },
    { key: 'common.view', lang: 'th', value: 'ดู' },
    { key: 'common.create', lang: 'th', value: 'สร้าง' },
    { key: 'common.search', lang: 'th', value: 'ค้นหา' },
    { key: 'common.export', lang: 'th', value: 'ส่งออก' },
    { key: 'common.yes', lang: 'th', value: 'ใช่' },
    { key: 'common.no', lang: 'th', value: 'ไม่' },
    { key: 'common.loading', lang: 'th', value: 'กำลังโหลด...' },
    
    // Auth - Thai
    { key: 'auth.login', lang: 'th', value: 'เข้าสู่ระบบ' },
    { key: 'auth.logout', lang: 'th', value: 'ออกจากระบบ' },
    { key: 'auth.email', lang: 'th', value: 'อีเมล' },
    { key: 'auth.password', lang: 'th', value: 'รหัสผ่าน' },
    
    // Navigation - Thai
    { key: 'nav.dashboard', lang: 'th', value: 'แดชบอร์ด' },
    { key: 'nav.users', lang: 'th', value: 'ผู้ใช้' },
    { key: 'nav.content', lang: 'th', value: 'เนื้อหา' },
    { key: 'nav.settings', lang: 'th', value: 'ตั้งค่า' },
    
    // Messages - Thai
    { key: 'msg.success', lang: 'th', value: 'ดำเนินการเสร็จสิ้น' },
    { key: 'msg.error', lang: 'th', value: 'เกิดข้อผิดพลาด' },
    { key: 'msg.confirm_delete', lang: 'th', value: 'คุณแน่ใจหรือไม่ที่จะลบรายการนี้?' },
    { key: 'msg.no_data', lang: 'th', value: 'ไม่มีข้อมูล' },
  ];

  for (const trans of labelTranslations) {
    const label = await prisma.sys_label.findUnique({ where: { key: trans.key } });
    if (label) {
      await prisma.sys_label_translation.upsert({
        where: {
          label_id_language_code: {
            label_id: label.id,
            language_code: trans.lang,
          },
        },
        update: {},
        create: {
          label_id: label.id,
          language_code: trans.lang,
          value: trans.value,
          created_by: adminUser.id,
          created_by_name: 'System Administrator',
        },
      });
    }
  }

  // Create notifications
  console.log('🔔 Creating sample notifications...');
  await prisma.sys_notification.createMany({
    data: [
      {
        type: 'info',
        title: 'Welcome to the system',
        body: 'Thank you for joining our platform. Feel free to explore all features.',
        user_id: adminUser.id,
        created_by: adminUser.id,
        created_by_name: 'System',
      },
      {
        type: 'success',
        title: 'Profile Updated',
        body: 'Your profile has been successfully updated.',
        user_id: editorUser.id,
        is_read: true,
        read_date: new Date(),
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
      {
        type: 'warning',
        title: 'Password Expiry Warning',
        body: 'Your password will expire in 7 days. Please update it soon.',
        user_id: normalUser.id,
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📋 Test Accounts:');
  console.log('================');
  console.log('Admin: admin@jairak.com / admin123');
  console.log('Editor: editor@jairak.com / editor123');
  console.log('User: user@jairak.com / user123');
  console.log('Azure User: azure.user@jairak.com (Azure AD login)');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
