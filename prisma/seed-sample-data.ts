import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting to seed sample data...");

  // Check if sample data already exists
  const existingCategory = await prisma.mod_category.findFirst({
    where: { id: "cat-news-001" }
  });

  if (existingCategory) {
    console.log("⚠️  Sample data already exists. Skipping...");
    return;
  }

  // Check if we have a user to use as creator
  const existingUser = await prisma.sys_user.findFirst({
    where: { is_active: true }
  });

  const creatorId = existingUser?.id || null;
  const creatorName = existingUser ? `${existingUser.first_name} ${existingUser.last_name}` : "System";

  // Create sample categories
  const newsCategory = await prisma.mod_category.create({
    data: {
      id: "cat-news-001",
      name: "News & Updates",
      slug: "news-updates",
      description: "Latest news and updates",
      sort_order: 1,
      is_active: true,
      created_by: creatorId,
      created_by_name: creatorName,
      created_date: new Date(),
      updated_by: creatorId,
      updated_by_name: creatorName,
      updated_date: new Date(),
      translations: {
        create: [
          {
            language_code: "th",
            name: "ข่าวสารและอัปเดต",
            description: "ข่าวสารและอัปเดตล่าสุด",
            created_by: creatorId,
            created_by_name: creatorName,
            created_date: new Date(),
            updated_by: creatorId,
            updated_by_name: creatorName,
            updated_date: new Date()
          }
        ]
      }
    }
  });

  const productCategory = await prisma.mod_category.create({
    data: {
      id: "cat-product-001",
      name: "Products",
      slug: "products",
      description: "Our products and services",
      sort_order: 2,
      is_active: true,
      created_by: creatorId,
      created_by_name: creatorName,
      created_date: new Date(),
      updated_by: creatorId,
      updated_by_name: creatorName,
      updated_date: new Date(),
      translations: {
        create: [
          {
            language_code: "th",
            name: "ผลิตภัณฑ์",
            description: "ผลิตภัณฑ์และบริการของเรา",
            created_by: creatorId,
            created_by_name: creatorName,
            created_date: new Date(),
            updated_by: creatorId,
            updated_by_name: creatorName,
            updated_date: new Date()
          }
        ]
      }
    }
  });

  const knowledgeCategory = await prisma.mod_category.create({
    data: {
      id: "cat-knowledge-001",
      name: "Knowledge Base",
      slug: "knowledge-base",
      description: "Articles and tutorials",
      sort_order: 3,
      is_active: true,
      created_by: creatorId,
      created_by_name: creatorName,
      created_date: new Date(),
      updated_by: creatorId,
      updated_by_name: creatorName,
      updated_date: new Date(),
      translations: {
        create: [
          {
            language_code: "th",
            name: "ฐานความรู้",
            description: "บทความและบทเรียน",
            created_by: creatorId,
            created_by_name: creatorName,
            created_date: new Date(),
            updated_by: creatorId,
            updated_by_name: creatorName,
            updated_date: new Date()
          }
        ]
      }
    }
  });

  // Create subcategories
  const companyNews = await prisma.mod_category.create({
    data: {
      id: "cat-company-news-001",
      name: "Company News",
      slug: "company-news",
      description: "News about our company",
      parent_id: newsCategory.id,
      sort_order: 1,
      is_active: true,
      created_by: creatorId,
      created_by_name: creatorName,
      created_date: new Date(),
      updated_by: creatorId,
      updated_by_name: creatorName,
      updated_date: new Date(),
      translations: {
        create: [
          {
            language_code: "th",
            name: "ข่าวบริษัท",
            description: "ข่าวเกี่ยวกับบริษัทของเรา",
            created_by: creatorId,
            created_by_name: creatorName,
            created_date: new Date(),
            updated_by: creatorId,
            updated_by_name: creatorName,
            updated_date: new Date()
          }
        ]
      }
    }
  });

  const industryNews = await prisma.mod_category.create({
    data: {
      id: "cat-industry-news-001",
      name: "Industry News",
      slug: "industry-news",
      description: "News about the industry",
      parent_id: newsCategory.id,
      sort_order: 2,
      is_active: true,
      created_by: creatorId,
      created_by_name: creatorName,
      created_date: new Date(),
      updated_by: creatorId,
      updated_by_name: creatorName,
      updated_date: new Date(),
      translations: {
        create: [
          {
            language_code: "th",
            name: "ข่าวอุตสาหกรรม",
            description: "ข่าวเกี่ยวกับอุตสาหกรรม",
            created_by: creatorId,
            created_by_name: creatorName,
            created_date: new Date(),
            updated_by: creatorId,
            updated_by_name: creatorName,
            updated_date: new Date()
          }
        ]
      }
    }
  });

  console.log("✅ Categories created");

  // Create sample contents
  const content1 = await prisma.mod_content.create({
    data: {
      id: "content-001",
      title: "Welcome to Our New Platform",
      slug: "welcome-new-platform",
      content: `<h2>Welcome to Our New Platform</h2>
<p>We are excited to announce the launch of our new content management platform. This platform provides a comprehensive solution for managing your digital content with multi-language support.</p>
<h3>Key Features:</h3>
<ul>
  <li>Multi-language content management</li>
  <li>Role-based access control</li>
  <li>SEO-friendly URLs</li>
  <li>Rich text editor</li>
  <li>Media management</li>
</ul>
<p>Stay tuned for more updates!</p>`,
      excerpt: "We are excited to announce the launch of our new content management platform.",
      category_id: companyNews.id,
      status: "published",
      is_visible: true,
      view_count: 0,
      created_by: creatorId,
      created_by_name: creatorName,
      created_date: new Date(),
      updated_by: creatorId,
      updated_by_name: creatorName,
      updated_date: new Date(),
      translations: {
        create: [
          {
            language_code: "th",
            title: "ยินดีต้อนรับสู่แพลตฟอร์มใหม่ของเรา",
            content: `<h2>ยินดีต้อนรับสู่แพลตฟอร์มใหม่ของเรา</h2>
<p>เรารู้สึกตื่นเต้นที่จะประกาศการเปิดตัวแพลตฟอร์มการจัดการเนื้อหาใหม่ของเรา แพลตฟอร์มนี้มอบโซลูชันที่ครอบคลุมสำหรับการจัดการเนื้อหาดิจิทัลของคุณพร้อมการรองรับหลายภาษา</p>
<h3>คุณสมบัติหลัก:</h3>
<ul>
  <li>การจัดการเนื้อหาหลายภาษา</li>
  <li>การควบคุมการเข้าถึงตามบทบาท</li>
  <li>URL ที่เป็นมิตรกับ SEO</li>
  <li>โปรแกรมแก้ไขข้อความแบบ Rich Text</li>
  <li>การจัดการสื่อ</li>
</ul>
<p>ติดตามข่าวสารอัปเดตเพิ่มเติม!</p>`,
            excerpt: "เรารู้สึกตื่นเต้นที่จะประกาศการเปิดตัวแพลตฟอร์มการจัดการเนื้อหาใหม่ของเรา",
            created_by: creatorId,
            created_by_name: creatorName,
            created_date: new Date(),
            updated_by: creatorId,
            updated_by_name: creatorName,
            updated_date: new Date()
          }
        ]
      }
    }
  });

  const content2 = await prisma.mod_content.create({
    data: {
      id: "content-002",
      title: "Getting Started with Content Management",
      slug: "getting-started-content-management",
      content: `<h2>Getting Started with Content Management</h2>
<p>This guide will help you get started with our content management system. Follow these simple steps to create and manage your content effectively.</p>
<h3>Step 1: Understanding Categories</h3>
<p>Categories help organize your content into logical groups. You can create parent categories and subcategories to build a hierarchical structure.</p>
<h3>Step 2: Creating Content</h3>
<p>To create new content:</p>
<ol>
  <li>Navigate to the Content section</li>
  <li>Click on "Create New Content"</li>
  <li>Fill in the required fields</li>
  <li>Add translations if needed</li>
  <li>Save and publish</li>
</ol>
<h3>Step 3: Managing Translations</h3>
<p>Our system supports multiple languages. You can add translations for each piece of content to reach a wider audience.</p>`,
      excerpt: "A comprehensive guide to get started with our content management system.",
      category_id: knowledgeCategory.id,
      status: "published",
      is_visible: true,
      view_count: 0,
      created_by: creatorId,
      created_by_name: creatorName,
      updated_by: creatorId,
      updated_by_name: creatorName,
      translations: {
        create: [
          {
            language_code: "th",
            title: "เริ่มต้นใช้งานระบบจัดการเนื้อหา",
            content: `<h2>เริ่มต้นใช้งานระบบจัดการเนื้อหา</h2>
<p>คู่มือนี้จะช่วยให้คุณเริ่มต้นใช้งานระบบจัดการเนื้อหาของเรา ทำตามขั้นตอนง่ายๆ เหล่านี้เพื่อสร้างและจัดการเนื้อหาของคุณอย่างมีประสิทธิภาพ</p>
<h3>ขั้นตอนที่ 1: ทำความเข้าใจหมวดหมู่</h3>
<p>หมวดหมู่ช่วยจัดระเบียบเนื้อหาของคุณเป็นกลุ่มตามหลักเหตุผล คุณสามารถสร้างหมวดหมู่หลักและหมวดหมู่ย่อยเพื่อสร้างโครงสร้างแบบลำดับชั้น</p>
<h3>ขั้นตอนที่ 2: การสร้างเนื้อหา</h3>
<p>วิธีสร้างเนื้อหาใหม่:</p>
<ol>
  <li>ไปที่ส่วนเนื้อหา</li>
  <li>คลิกที่ "สร้างเนื้อหาใหม่"</li>
  <li>กรอกข้อมูลในช่องที่จำเป็น</li>
  <li>เพิ่มการแปลหากต้องการ</li>
  <li>บันทึกและเผยแพร่</li>
</ol>
<h3>ขั้นตอนที่ 3: การจัดการการแปล</h3>
<p>ระบบของเรารองรับหลายภาษา คุณสามารถเพิ่มการแปลสำหรับเนื้อหาแต่ละชิ้นเพื่อเข้าถึงผู้ชมที่กว้างขึ้น</p>`,
            excerpt: "คู่มือที่ครอบคลุมเพื่อเริ่มต้นใช้งานระบบจัดการเนื้อหาของเรา",
            created_by: creatorId,
            created_by_name: creatorName,
            created_date: new Date(),
            updated_by: creatorId,
            updated_by_name: creatorName,
            updated_date: new Date()
          }
        ]
      }
    }
  });

  const content3 = await prisma.mod_content.create({
    data: {
      id: "content-003",
      title: "New Product Launch: CMS Pro",
      slug: "new-product-launch-cms-pro",
      content: `<h2>Introducing CMS Pro</h2>
<p>We are thrilled to announce the launch of CMS Pro, our premium content management solution designed for enterprise clients.</p>
<h3>What's New in CMS Pro?</h3>
<ul>
  <li><strong>Advanced Analytics:</strong> Get detailed insights into your content performance</li>
  <li><strong>AI-Powered Translations:</strong> Automatic translation suggestions for faster localization</li>
  <li><strong>Custom Workflows:</strong> Design approval workflows that match your organization</li>
  <li><strong>API Access:</strong> Full API access for seamless integration</li>
  <li><strong>Priority Support:</strong> 24/7 dedicated support team</li>
</ul>
<h3>Pricing</h3>
<p>CMS Pro starts at $299/month for up to 10 users. Contact our sales team for enterprise pricing.</p>
<p><a href="/contact">Get in touch</a> to learn more about CMS Pro.</p>`,
      excerpt: "Announcing CMS Pro - our premium content management solution for enterprise clients.",
      category_id: productCategory.id,
      status: "published",
      is_visible: true,
      view_count: 0,
      created_by: creatorId,
      created_by_name: creatorName,
      updated_by: creatorId,
      updated_by_name: creatorName,
      translations: {
        create: [
          {
            language_code: "th",
            title: "เปิดตัวผลิตภัณฑ์ใหม่: CMS Pro",
            content: `<h2>ขอแนะนำ CMS Pro</h2>
<p>เรารู้สึกตื่นเต้นที่จะประกาศการเปิดตัว CMS Pro โซลูชันการจัดการเนื้อหาระดับพรีเมียมของเราที่ออกแบบมาสำหรับลูกค้าองค์กร</p>
<h3>มีอะไรใหม่ใน CMS Pro?</h3>
<ul>
  <li><strong>การวิเคราะห์ขั้นสูง:</strong> รับข้อมูลเชิงลึกโดยละเอียดเกี่ยวกับประสิทธิภาพเนื้อหาของคุณ</li>
  <li><strong>การแปลด้วย AI:</strong> คำแนะนำการแปลอัตโนมัติเพื่อการแปลเป็นภาษาท้องถิ่นที่รวดเร็วขึ้น</li>
  <li><strong>เวิร์กโฟลว์ที่กำหนดเอง:</strong> ออกแบบเวิร์กโฟลว์การอนุมัติที่ตรงกับองค์กรของคุณ</li>
  <li><strong>การเข้าถึง API:</strong> การเข้าถึง API แบบเต็มรูปแบบเพื่อการผสานรวมที่ราบรื่น</li>
  <li><strong>การสนับสนุนลำดับความสำคัญ:</strong> ทีมสนับสนุนเฉพาะตลอด 24/7</li>
</ul>
<h3>ราคา</h3>
<p>CMS Pro เริ่มต้นที่ $299/เดือน สำหรับผู้ใช้สูงสุด 10 คน ติดต่อทีมขายของเราสำหรับราคาองค์กร</p>
<p><a href="/contact">ติดต่อเรา</a> เพื่อเรียนรู้เพิ่มเติมเกี่ยวกับ CMS Pro</p>`,
            excerpt: "ประกาศ CMS Pro - โซลูชันการจัดการเนื้อหาระดับพรีเมียมสำหรับลูกค้าองค์กร",
            created_by: creatorId,
            created_by_name: creatorName,
            created_date: new Date(),
            updated_by: creatorId,
            updated_by_name: creatorName,
            updated_date: new Date()
          }
        ]
      }
    }
  });

  const content4 = await prisma.mod_content.create({
    data: {
      id: "content-004",
      title: "Industry Trends: The Future of Content Management",
      slug: "industry-trends-future-content-management",
      content: `<h2>The Future of Content Management</h2>
<p>As we move into 2025, the content management landscape is evolving rapidly. Here are the key trends shaping the future of how we create, manage, and deliver content.</p>
<h3>1. AI-Driven Content Creation</h3>
<p>Artificial Intelligence is revolutionizing content creation. From automated writing assistants to intelligent content recommendations, AI is making content teams more productive than ever.</p>
<h3>2. Headless CMS Architecture</h3>
<p>The decoupling of content management from presentation layers allows for greater flexibility in content delivery across multiple channels and devices.</p>
<h3>3. Personalization at Scale</h3>
<p>Advanced analytics and machine learning enable hyper-personalized content experiences for each user, improving engagement and conversion rates.</p>
<h3>4. Voice and Conversational Interfaces</h3>
<p>As voice assistants become more prevalent, content needs to be optimized for voice search and conversational interfaces.</p>
<h3>5. Enhanced Security and Privacy</h3>
<p>With increasing data regulations, content management systems are implementing stronger security measures and privacy controls.</p>
<p>Stay ahead of the curve by embracing these trends in your content strategy.</p>`,
      excerpt: "Explore the key trends shaping the future of content management in 2025 and beyond.",
      category_id: industryNews.id,
      status: "published",
      is_visible: true,
      view_count: 0,
      created_by: creatorId,
      created_by_name: creatorName,
      updated_by: creatorId,
      updated_by_name: creatorName,
      translations: {
        create: [
          {
            language_code: "th",
            title: "แนวโน้มอุตสาหกรรม: อนาคตของการจัดการเนื้อหา",
            content: `<h2>อนาคตของการจัดการเนื้อหา</h2>
<p>เมื่อเราก้าวเข้าสู่ปี 2025 ภูมิทัศน์การจัดการเนื้อหากำลังพัฒนาอย่างรวดเร็ว นี่คือแนวโน้มสำคัญที่กำลังกำหนดอนาคตของวิธีที่เราสร้าง จัดการ และส่งมอบเนื้อหา</p>
<h3>1. การสร้างเนื้อหาด้วย AI</h3>
<p>ปัญญาประดิษฐ์กำลังปฏิวัติการสร้างเนื้อหา ตั้งแต่ผู้ช่วยการเขียนอัตโนมัติไปจนถึงคำแนะนำเนื้อหาอัจฉริยะ AI กำลังทำให้ทีมเนื้อหามีประสิทธิภาพมากขึ้นกว่าเดิม</p>
<h3>2. สถาปัตยกรรม Headless CMS</h3>
<p>การแยกการจัดการเนื้อหาออกจากเลเยอร์การนำเสนอช่วยให้มีความยืดหยุ่นมากขึ้นในการส่งมอบเนื้อหาผ่านหลายช่องทางและอุปกรณ์</p>
<h3>3. การปรับแต่งเฉพาะบุคคลในวงกว้าง</h3>
<p>การวิเคราะห์ขั้นสูงและการเรียนรู้ของเครื่องช่วยให้สามารถสร้างประสบการณ์เนื้อหาที่ปรับแต่งเฉพาะบุคคลสูงสำหรับผู้ใช้แต่ละคน ปรับปรุงการมีส่วนร่วมและอัตราการแปลง</p>
<h3>4. อินเทอร์เฟซเสียงและการสนทนา</h3>
<p>เมื่อผู้ช่วยเสียงแพร่หลายมากขึ้น เนื้อหาจำเป็นต้องได้รับการปรับให้เหมาะสมสำหรับการค้นหาด้วยเสียงและอินเทอร์เฟซการสนทนา</p>
<h3>5. ความปลอดภัยและความเป็นส่วนตัวที่เพิ่มขึ้น</h3>
<p>ด้วยกฎระเบียบข้อมูลที่เพิ่มขึ้น ระบบการจัดการเนื้อหากำลังใช้มาตรการรักษาความปลอดภัยที่แข็งแกร่งขึ้นและการควบคุมความเป็นส่วนตัว</p>
<p>อยู่ข้างหน้าเส้นโค้งโดยการยอมรับแนวโน้มเหล่านี้ในกลยุทธ์เนื้อหาของคุณ</p>`,
            excerpt: "สำรวจแนวโน้มสำคัญที่กำลังกำหนดอนาคตของการจัดการเนื้อหาในปี 2025 และต่อไป",
            created_by: creatorId,
            created_by_name: creatorName,
            created_date: new Date(),
            updated_by: creatorId,
            updated_by_name: creatorName,
            updated_date: new Date()
          }
        ]
      }
    }
  });

  console.log("✅ Contents created");

  // Create draft content
  const draftContent = await prisma.mod_content.create({
    data: {
      id: "content-005",
      title: "Best Practices for Multi-language Content",
      slug: "best-practices-multilanguage-content",
      content: `<h2>Best Practices for Multi-language Content</h2>
<p>This article is still being written...</p>`,
      excerpt: "Learn the best practices for managing content in multiple languages.",
      category_id: knowledgeCategory.id,
      status: "draft",
      is_visible: false,
      view_count: 0,
      created_by: creatorId,
      created_by_name: creatorName,
      created_date: new Date(),
      updated_by: creatorId,
      updated_by_name: creatorName,
      updated_date: new Date()
    }
  });

  console.log("✅ Draft content created");

  console.log("🎉 Sample data seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
