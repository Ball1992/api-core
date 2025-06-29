import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌐 Starting multilingual data seed...');

  // Get admin user for created_by fields
  const adminUser = await prisma.sys_user.findFirst({
    where: { email: 'admin@jairak.com' }
  });

  if (!adminUser) {
    console.error('❌ Admin user not found. Please run the main seed first.');
    return;
  }

  // Additional Labels with Thai translations
  console.log('🏷️ Creating additional labels with translations...');
  
  const additionalLabels = [
    // Form labels
    { key: 'form.required_field', default: 'Required field', thai: 'ฟิลด์บังคับ' },
    { key: 'form.optional_field', default: 'Optional field', thai: 'ฟิลด์ไม่บังคับ' },
    { key: 'form.select_option', default: 'Select an option', thai: 'เลือกตัวเลือก' },
    { key: 'form.upload_file', default: 'Upload file', thai: 'อัปโหลดไฟล์' },
    { key: 'form.choose_file', default: 'Choose file', thai: 'เลือกไฟล์' },
    { key: 'form.no_file_chosen', default: 'No file chosen', thai: 'ยังไม่ได้เลือกไฟล์' },
    
    // Status labels
    { key: 'status.active', default: 'Active', thai: 'ใช้งาน' },
    { key: 'status.inactive', default: 'Inactive', thai: 'ไม่ใช้งาน' },
    { key: 'status.pending', default: 'Pending', thai: 'รอดำเนินการ' },
    { key: 'status.approved', default: 'Approved', thai: 'อนุมัติแล้ว' },
    { key: 'status.rejected', default: 'Rejected', thai: 'ปฏิเสธ' },
    { key: 'status.draft', default: 'Draft', thai: 'แบบร่าง' },
    { key: 'status.published', default: 'Published', thai: 'เผยแพร่แล้ว' },
    { key: 'status.archived', default: 'Archived', thai: 'เก็บถาวร' },
    
    // Date/Time labels
    { key: 'datetime.today', default: 'Today', thai: 'วันนี้' },
    { key: 'datetime.yesterday', default: 'Yesterday', thai: 'เมื่อวาน' },
    { key: 'datetime.tomorrow', default: 'Tomorrow', thai: 'พรุ่งนี้' },
    { key: 'datetime.this_week', default: 'This week', thai: 'สัปดาห์นี้' },
    { key: 'datetime.last_week', default: 'Last week', thai: 'สัปดาห์ที่แล้ว' },
    { key: 'datetime.this_month', default: 'This month', thai: 'เดือนนี้' },
    { key: 'datetime.last_month', default: 'Last month', thai: 'เดือนที่แล้ว' },
    
    // Table headers
    { key: 'table.id', default: 'ID', thai: 'รหัส' },
    { key: 'table.name', default: 'Name', thai: 'ชื่อ' },
    { key: 'table.description', default: 'Description', thai: 'คำอธิบาย' },
    { key: 'table.created_date', default: 'Created Date', thai: 'วันที่สร้าง' },
    { key: 'table.updated_date', default: 'Updated Date', thai: 'วันที่แก้ไข' },
    { key: 'table.created_by', default: 'Created By', thai: 'สร้างโดย' },
    { key: 'table.actions', default: 'Actions', thai: 'การดำเนินการ' },
    { key: 'table.status', default: 'Status', thai: 'สถานะ' },
    
    // Pagination
    { key: 'pagination.first', default: 'First', thai: 'หน้าแรก' },
    { key: 'pagination.last', default: 'Last', thai: 'หน้าสุดท้าย' },
    { key: 'pagination.showing', default: 'Showing', thai: 'แสดง' },
    { key: 'pagination.of', default: 'of', thai: 'จาก' },
    { key: 'pagination.entries', default: 'entries', thai: 'รายการ' },
    { key: 'pagination.per_page', default: 'Per page', thai: 'ต่อหน้า' },
    
    // Confirmation messages
    { key: 'confirm.save_changes', default: 'Do you want to save changes?', thai: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?' },
    { key: 'confirm.discard_changes', default: 'Discard unsaved changes?', thai: 'ยกเลิกการเปลี่ยนแปลงที่ยังไม่บันทึก?' },
    { key: 'confirm.logout', default: 'Are you sure you want to logout?', thai: 'คุณแน่ใจหรือไม่ที่จะออกจากระบบ?' },
    
    // Error messages
    { key: 'error.not_found', default: 'Not found', thai: 'ไม่พบข้อมูล' },
    { key: 'error.unauthorized', default: 'Unauthorized', thai: 'ไม่มีสิทธิ์เข้าถึง' },
    { key: 'error.forbidden', default: 'Forbidden', thai: 'ไม่อนุญาต' },
    { key: 'error.server_error', default: 'Server error', thai: 'เซิร์ฟเวอร์ผิดพลาด' },
    { key: 'error.network_error', default: 'Network error', thai: 'เครือข่ายผิดพลาด' },
    
    // Success messages
    { key: 'success.saved', default: 'Saved successfully', thai: 'บันทึกเรียบร้อยแล้ว' },
    { key: 'success.updated', default: 'Updated successfully', thai: 'อัปเดตเรียบร้อยแล้ว' },
    { key: 'success.deleted', default: 'Deleted successfully', thai: 'ลบเรียบร้อยแล้ว' },
    { key: 'success.uploaded', default: 'Uploaded successfully', thai: 'อัปโหลดเรียบร้อยแล้ว' },
    
    // User interface
    { key: 'ui.home', default: 'Home', thai: 'หน้าแรก' },
    { key: 'ui.help', default: 'Help', thai: 'ช่วยเหลือ' },
    { key: 'ui.about', default: 'About', thai: 'เกี่ยวกับ' },
    { key: 'ui.contact', default: 'Contact', thai: 'ติดต่อ' },
    { key: 'ui.language', default: 'Language', thai: 'ภาษา' },
    { key: 'ui.theme', default: 'Theme', thai: 'ธีม' },
    { key: 'ui.dark_mode', default: 'Dark Mode', thai: 'โหมดมืด' },
    { key: 'ui.light_mode', default: 'Light Mode', thai: 'โหมดสว่าง' },
  ];

  for (const labelData of additionalLabels) {
    const label = await prisma.sys_label.upsert({
      where: { key: labelData.key },
      update: {},
      create: {
        key: labelData.key,
        default_value: labelData.default,
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    });

    // Create Thai translation
    await prisma.sys_label_translation.upsert({
      where: {
        label_id_language_code: {
          label_id: label.id,
          language_code: 'th',
        },
      },
      update: {},
      create: {
        label_id: label.id,
        language_code: 'th',
        value: labelData.thai,
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    });

    // Create English translation (same as default)
    await prisma.sys_label_translation.upsert({
      where: {
        label_id_language_code: {
          label_id: label.id,
          language_code: 'en',
        },
      },
      update: {},
      create: {
        label_id: label.id,
        language_code: 'en',
        value: labelData.default,
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    });
  }

  // Additional content categories with translations
  console.log('📂 Creating additional content categories...');
  
  const additionalCategories = [
    {
      name: 'Products',
      slug: 'products',
      description: 'Product information and details',
      thai_name: 'สินค้า',
      thai_desc: 'ข้อมูลและรายละเอียดสินค้า',
      sort_order: 4,
    },
    {
      name: 'Services',
      slug: 'services',
      description: 'Service offerings and descriptions',
      thai_name: 'บริการ',
      thai_desc: 'การให้บริการและคำอธิบาย',
      sort_order: 5,
    },
    {
      name: 'Events',
      slug: 'events',
      description: 'Upcoming events and activities',
      thai_name: 'กิจกรรม',
      thai_desc: 'กิจกรรมและงานที่จะมาถึง',
      sort_order: 6,
    },
    {
      name: 'Gallery',
      slug: 'gallery',
      description: 'Photo and video gallery',
      thai_name: 'แกลเลอรี',
      thai_desc: 'คลังภาพและวิดีโอ',
      sort_order: 7,
    },
  ];

  for (const catData of additionalCategories) {
    const category = await prisma.mod_category.upsert({
      where: { slug: catData.slug },
      update: {},
      create: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        sort_order: catData.sort_order,
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    });

    // Create translations
    await prisma.mod_category_translation.upsert({
      where: {
        category_id_language_code: {
          category_id: category.id,
          language_code: 'th',
        },
      },
      update: {},
      create: {
        category_id: category.id,
        language_code: 'th',
        name: catData.thai_name,
        description: catData.thai_desc,
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    });

    await prisma.mod_category_translation.upsert({
      where: {
        category_id_language_code: {
          category_id: category.id,
          language_code: 'en',
        },
      },
      update: {},
      create: {
        category_id: category.id,
        language_code: 'en',
        name: catData.name,
        description: catData.description,
        created_by: adminUser.id,
        created_by_name: 'System Administrator',
      },
    });
  }

  // Additional content with translations
  console.log('📝 Creating additional multilingual content...');

  const productsCategory = await prisma.mod_category.findUnique({ where: { slug: 'products' } });
  const servicesCategory = await prisma.mod_category.findUnique({ where: { slug: 'services' } });
  const eventsCategory = await prisma.mod_category.findUnique({ where: { slug: 'events' } });

  if (productsCategory && servicesCategory && eventsCategory) {
    const additionalContents = [
      {
        title: 'Our Premium Products',
        slug: 'premium-products',
        content: `# Our Premium Products\n\nWe offer a wide range of premium products designed to meet your needs.\n\n## Features\n- High quality materials\n- Modern design\n- Competitive pricing\n- Excellent warranty\n\n## Categories\n1. Electronics\n2. Home & Garden\n3. Fashion\n4. Sports & Outdoors`,
        excerpt: 'Discover our premium product collection',
        category_id: productsCategory.id,
        thai_title: 'สินค้าพรีเมียมของเรา',
        thai_content: `# สินค้าพรีเมียมของเรา\n\nเรานำเสนอสินค้าพรีเมียมหลากหลายที่ออกแบบมาเพื่อตอบสนองความต้องการของคุณ\n\n## คุณสมบัติ\n- วัสดุคุณภาพสูง\n- ดีไซน์ทันสมัย\n- ราคาแข่งขันได้\n- การรับประกันที่ยอดเยี่ยม\n\n## หมวดหมู่\n1. อิเล็กทรอนิกส์\n2. บ้านและสวน\n3. แฟชั่น\n4. กีฬาและกิจกรรมกลางแจ้ง`,
        thai_excerpt: 'ค้นพบคอลเลกชันสินค้าพรีเมียมของเรา',
      },
      {
        title: 'Professional Services',
        slug: 'professional-services',
        content: `# Professional Services\n\nOur team of experts provides top-notch professional services.\n\n## What We Offer\n- Consulting\n- Implementation\n- Training\n- Support\n\n## Why Choose Us\n- Experienced professionals\n- Proven track record\n- Customer-focused approach\n- Competitive rates`,
        excerpt: 'Expert services for your business needs',
        category_id: servicesCategory.id,
        thai_title: 'บริการระดับมืออาชีพ',
        thai_content: `# บริการระดับมืออาชีพ\n\nทีมผู้เชี่ยวชาญของเราให้บริการระดับมืออาชีพชั้นยอด\n\n## สิ่งที่เรานำเสนอ\n- การให้คำปรึกษา\n- การดำเนินการ\n- การฝึกอบรม\n- การสนับสนุน\n\n## ทำไมต้องเลือกเรา\n- ผู้เชี่ยวชาญที่มีประสบการณ์\n- ผลงานที่พิสูจน์แล้ว\n- แนวทางที่เน้นลูกค้า\n- อัตราที่แข่งขันได้`,
        thai_excerpt: 'บริการจากผู้เชี่ยวชาญสำหรับความต้องการทางธุรกิจของคุณ',
      },
      {
        title: 'Annual Tech Conference 2024',
        slug: 'tech-conference-2024',
        content: `# Annual Tech Conference 2024\n\nJoin us for the biggest tech event of the year!\n\n## Event Details\n- **Date**: December 15-17, 2024\n- **Location**: Bangkok Convention Center\n- **Time**: 9:00 AM - 6:00 PM\n\n## Highlights\n- Keynote speakers from leading tech companies\n- Hands-on workshops\n- Networking opportunities\n- Product exhibitions\n\n## Registration\nEarly bird tickets available until November 30, 2024.`,
        excerpt: 'The biggest tech event of the year',
        category_id: eventsCategory.id,
        thai_title: 'งานประชุมเทคโนโลยีประจำปี 2024',
        thai_content: `# งานประชุมเทคโนโลยีประจำปี 2024\n\nร่วมกับเราในงานเทคโนโลยีที่ยิ่งใหญ่ที่สุดแห่งปี!\n\n## รายละเอียดงาน\n- **วันที่**: 15-17 ธันวาคม 2024\n- **สถานที่**: ศูนย์การประชุมกรุงเทพฯ\n- **เวลา**: 9:00 - 18:00 น.\n\n## ไฮไลท์\n- วิทยากรหลักจากบริษัทเทคโนโลยีชั้นนำ\n- เวิร์กช็อปภาคปฏิบัติ\n- โอกาสในการสร้างเครือข่าย\n- นิทรรศการผลิตภัณฑ์\n\n## การลงทะเบียน\nบัตรราคาพิเศษจำหน่ายถึง 30 พฤศจิกายน 2024`,
        thai_excerpt: 'งานเทคโนโลยีที่ยิ่งใหญ่ที่สุดแห่งปี',
      },
    ];

    for (const contentData of additionalContents) {
      const content = await prisma.mod_content.upsert({
        where: { slug: contentData.slug },
        update: {},
        create: {
          title: contentData.title,
          slug: contentData.slug,
          content: contentData.content,
          excerpt: contentData.excerpt,
          category_id: contentData.category_id,
          status: 'published',
          created_by: adminUser.id,
          created_by_name: 'System Administrator',
        },
      });

      // Create translations
      await prisma.mod_content_translation.upsert({
        where: {
          content_id_language_code: {
            content_id: content.id,
            language_code: 'th',
          },
        },
        update: {},
        create: {
          content_id: content.id,
          language_code: 'th',
          title: contentData.thai_title,
          content: contentData.thai_content,
          excerpt: contentData.thai_excerpt,
          created_by: adminUser.id,
          created_by_name: 'System Administrator',
        },
      });

      await prisma.mod_content_translation.upsert({
        where: {
          content_id_language_code: {
            content_id: content.id,
            language_code: 'en',
          },
        },
        update: {},
        create: {
          content_id: content.id,
          language_code: 'en',
          title: contentData.title,
          content: contentData.content,
          excerpt: contentData.excerpt,
          created_by: adminUser.id,
          created_by_name: 'System Administrator',
        },
      });
    }
  }

  // Additional menus with translations
  console.log('📁 Creating additional menus...');
  
  const reportsMenu = await prisma.sys_menu.upsert({
    where: { slug: 'reports' },
    update: {},
    create: {
      name: 'Reports',
      slug: 'reports',
      icon: 'chart',
      sort_order: 5,
      created_by_name: 'System Administrator',
    },
  });

  const salesReportMenu = await prisma.sys_menu.upsert({
    where: { slug: 'sales-report' },
    update: {},
    create: {
      name: 'Sales Report',
      slug: 'sales-report',
      icon: 'bar-chart',
      url: '/reports/sales',
      parent_id: reportsMenu.id,
      sort_order: 1,
      created_by_name: 'System Administrator',
    },
  });

  const userReportMenu = await prisma.sys_menu.upsert({
    where: { slug: 'user-report' },
    update: {},
    create: {
      name: 'User Report',
      slug: 'user-report',
      icon: 'pie-chart',
      url: '/reports/users',
      parent_id: reportsMenu.id,
      sort_order: 2,
      created_by_name: 'System Administrator',
    },
  });

  // Create menu translations
  const additionalMenuTranslations = [
    { menu: reportsMenu, lang: 'th', name: 'รายงาน' },
    { menu: salesReportMenu, lang: 'th', name: 'รายงานการขาย' },
    { menu: userReportMenu, lang: 'th', name: 'รายงานผู้ใช้' },
  ];

  for (const trans of additionalMenuTranslations) {
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
        created_by_name: 'System Administrator',
      },
    });
  }

  // Additional system settings
  console.log('⚙️ Creating additional system settings...');
  
  const additionalSettings = [
    {
      key: 'date_format',
      value: 'DD/MM/YYYY',
      description: 'Date format used throughout the system',
    },
    {
      key: 'time_format',
      value: '24h',
      description: 'Time format (12h or 24h)',
    },
    {
      key: 'currency',
      value: 'THB',
      description: 'Default currency',
    },
    {
      key: 'timezone',
      value: 'Asia/Bangkok',
      description: 'System timezone',
    },
    {
      key: 'items_per_page',
      value: '20',
      description: 'Default number of items per page in lists',
    },
    {
      key: 'enable_notifications',
      value: 'true',
      description: 'Enable system notifications',
    },
    {
      key: 'maintenance_mode',
      value: 'false',
      description: 'Enable maintenance mode',
    },
  ];

  for (const setting of additionalSettings) {
    await prisma.sys_setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
        description: setting.description,
        created_by_name: 'System Administrator',
      },
    });
  }

  console.log('✅ Multilingual data seeded successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('- Added additional labels with Thai translations');
  console.log('- Created new content categories (Products, Services, Events, Gallery)');
  console.log('- Added multilingual content examples');
  console.log('- Created Reports menu with submenus');
  console.log('- Added system settings for localization');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding multilingual data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
