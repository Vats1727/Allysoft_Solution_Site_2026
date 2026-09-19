<?php

require_once __DIR__ . '/../config/Database.php';

try {
    $pdo = Database::connect();

    // Rebuild tables list
    $tables = [
        "DROP TABLE IF EXISTS users",
        "DROP TABLE IF EXISTS navbar_section",
        "DROP TABLE IF EXISTS hero_section",
        "DROP TABLE IF EXISTS services_settings",
        "DROP TABLE IF EXISTS services",
        "DROP TABLE IF EXISTS work_settings",
        "DROP TABLE IF EXISTS projects",
        "DROP TABLE IF EXISTS stack_settings",
        "DROP TABLE IF EXISTS stack",
        "DROP TABLE IF EXISTS why_ally_section",
        "DROP TABLE IF EXISTS why_ally_points",
        "DROP TABLE IF EXISTS how_we_work_settings",
        "DROP TABLE IF EXISTS how_we_work_steps",
        "DROP TABLE IF EXISTS why_choose_us_settings",
        "DROP TABLE IF EXISTS why_choose_us",
        "DROP TABLE IF EXISTS about_section",
        "DROP TABLE IF EXISTS about_bullets",
        "DROP TABLE IF EXISTS team_settings",
        "DROP TABLE IF EXISTS team",
        "DROP TABLE IF EXISTS contact_section",
        "DROP TABLE IF EXISTS footer_section",
        "DROP TABLE IF EXISTS submissions",
        "DROP TABLE IF EXISTS otp_codes"
    ];

    foreach ($tables as $dropSql) {
        $pdo->exec($dropSql);
    }

    // Provision Tables
    $pdo->exec("CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE navbar_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        logo TEXT,
        btn_text TEXT,
        btn_href TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE hero_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag TEXT,
        title_line1 TEXT,
        title_line2 TEXT,
        title_line3 TEXT,
        description TEXT,
        btn1_text TEXT,
        btn1_href TEXT,
        btn2_text TEXT,
        btn2_href TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE services_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge TEXT,
        title TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT,
        title TEXT,
        desc TEXT,
        sort_order INTEGER DEFAULT 0,
        status_toggle TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE work_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge TEXT,
        title TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE,
        title TEXT,
        category TEXT,
        image TEXT,
        description TEXT,
        tags TEXT, -- JSON Array representation
        link TEXT,
        features TEXT, -- JSON Array representation
        pricing TEXT, -- JSON Array representation
        sort_order INTEGER DEFAULT 0,
        status_toggle TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE stack_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge TEXT,
        title TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE stack (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT,
        title TEXT,
        items TEXT,
        sort_order INTEGER DEFAULT 0,
        status_toggle TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE why_ally_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge TEXT,
        title TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE why_ally_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        desc TEXT,
        sort_order INTEGER DEFAULT 0,
        status_toggle TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE how_we_work_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge TEXT,
        title TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE how_we_work_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        n TEXT,
        title TEXT,
        desc TEXT,
        milestones TEXT, -- JSON Array representation
        sort_order INTEGER DEFAULT 0,
        status_toggle TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE why_choose_us_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge TEXT,
        title TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE why_choose_us (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT,
        title TEXT,
        desc TEXT,
        sort_order INTEGER DEFAULT 0,
        status_toggle TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE about_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge TEXT,
        title TEXT,
        desc1 TEXT,
        desc2 TEXT,
        experience_num TEXT,
        experience_label TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE about_bullets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon TEXT,
        title TEXT,
        sort_order INTEGER DEFAULT 0,
        status_toggle TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE team_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge TEXT,
        title TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE team (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        role TEXT,
        bio TEXT,
        tag TEXT,
        image TEXT,
        object_position TEXT DEFAULT 'center',
        scale REAL DEFAULT 1.0,
        transform_origin TEXT DEFAULT 'center',
        sort_order INTEGER DEFAULT 0,
        status_toggle TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE contact_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        desc TEXT,
        address TEXT,
        address_icon TEXT DEFAULT 'MapPin',
        phone1 TEXT,
        phone2 TEXT,
        phone_icon TEXT DEFAULT 'Phone',
        email TEXT,
        email_icon TEXT DEFAULT 'Mail',
        hours TEXT,
        hours_icon TEXT DEFAULT 'Clock',
        owner_email TEXT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE footer_section (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand_name TEXT,
        brand_tagline TEXT,
        copyright TEXT,
        links_text TEXT,
        facebook_url TEXT DEFAULT '#',
        instagram_url TEXT DEFAULT '#',
        linkedin_url TEXT DEFAULT '#',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE contact_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT,
        value TEXT,
        icon TEXT,
        sort_order INTEGER DEFAULT 0,
        status_toggle TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE otp_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        code TEXT,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    echo "Tables created successfully.\n";

    // 1. Seed Users
    $password = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute(['Administrator', 'admin@gmail.com', $password, 'admin']);

    // 2. Seed Navbar
    $stmtNav = $pdo->prepare("INSERT INTO navbar_section (logo, btn_text, btn_href) VALUES (?, ?, ?)");
    $stmtNav->execute(['/logo-white.png', 'Start Your Build', '#contact']);

    // 3. Seed Hero
    $stmtHero = $pdo->prepare("INSERT INTO hero_section (tag, title_line1, title_line2, title_line3, description, btn1_text, btn1_href, btn2_text, btn2_href) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmtHero->execute([
        'Backend-first partners for startups',
        'Build fast.',
        'Scale smart.',
        'Sleep easy.',
        'We ship clean products that do the heavy lifting, without the heavy drama — mobile apps, web backends, and MVPs built to hold up under real traffic.',
        'Start Your Build',
        '#contact',
        'See Our Work',
        '#work'
    ]);

    // 4. Seed Services Settings
    $pdo->exec("INSERT INTO services_settings (badge, title) VALUES ('What we do', 'Our Services')");

    // 5. Seed Services items
    $stmtServices = $pdo->prepare("INSERT INTO services (icon, title, desc, sort_order) VALUES (?, ?, ?, ?)");
    $stmtServices->execute(['Smartphone', 'Mobile Apps', 'Apps that feel light and non-heavy — smooth on the oldest device in your users\' pockets.', 0]);
    $stmtServices->execute(['Server', 'Web Backends', 'Backends that stay calm under traffic spikes, built for the day your product goes viral.', 1]);
    $stmtServices->execute(['Rocket', 'MVPs', 'MVPs that fit the market quickly and grow gracefully as your user base does.', 2]);
    $stmtServices->execute(['Wrench', 'Custom Builds', 'Custom builds for the weird, the wild, and the wonderfully specific parts of your idea.', 3]);

    // 6. Seed Work Settings
    $stmtWorkSet = $pdo->prepare("INSERT INTO work_settings (badge, title, description) VALUES (?, ?, ?)");
    $stmtWorkSet->execute([
        'Our work', 
        "Projects We've Shipped", 
        'A showcase of custom digital products, secure cloud systems, and high-performance applications built for operational impact.'
    ]);

    // 7. Seed Projects/Work
    $stmtProj = $pdo->prepare("INSERT INTO projects (slug, title, category, image, description, tags, link, features, pricing, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // WA-Mitra features
    $waFeatures = [
        ['title' => 'Multi-Instance REST Gateway', 'desc' => 'Connect multiple WhatsApp accounts and manage isolated instances seamlessly through clean REST endpoints.'],
        ['title' => 'Bulk Campaign Dispatcher', 'desc' => 'Broadcast high-throughput message campaigns with automatic rate limiting, queueing, and delivery status logs.'],
        ['title' => 'Automated Keyword Auto-Replies', 'desc' => 'Configure smart webhooks and automated responses triggered by custom inbound keywords in real time.'],
        ['title' => 'Real-Time Webhook Engine', 'desc' => 'Receive instant HTTP POST callbacks for incoming messages, delivery reports, and instance disconnections.'],
        ['title' => 'Enterprise Session Encryption', 'desc' => 'Sub-second message delivery backed by 256-bit session encryption and 99.99% uptime SLA guarantee.'],
        ['title' => 'Interactive Developer Portal & API Docs', 'desc' => 'Comprehensive documentation, cURL snippets, and testing tools built directly into your dashboard.']
    ];
    $waPricing = [
        ['name' => 'Free', 'price' => '₹0', 'period' => '/ 7 Days', 'desc' => 'Billed per month', 'features' => ['5 WhatsApp Instances', 'Unlimited Contacts', 'Bulk Messaging (1,000 Msg)', 'Campaign Management', 'API Access & Integrations', 'Media Support (Images, PDFs)', 'Analytics Reports & Logs', 'Instant Webhooks'], 'cta' => 'Activate Free', 'highlight' => false],
        ['name' => 'Basic', 'price' => '₹349', 'period' => '/ 30 Days', 'desc' => 'Billed per month', 'features' => ['15 WhatsApp Instances', 'Unlimited Contacts', 'Bulk Messaging (5,000 Msg)', 'Campaign Management', 'API Access & Integrations', ['text' => 'Media Support (Images, PDFs)', 'disabled' => true], 'Analytics Reports & Logs', 'Instant Webhooks'], 'cta' => 'Choose Plan', 'highlight' => false],
        ['name' => 'Enterprise', 'price' => '₹499', 'period' => '/ 30 Days', 'desc' => 'Billed per month', 'features' => ['Unlimited WhatsApp Instances', 'Unlimited Contacts', 'Bulk Messaging (Unlimited Msg)', 'Campaign Management', 'API Access & Integrations', 'Media Support (Images, PDFs)', 'Analytics Reports & Logs', 'Instant Webhooks'], 'cta' => 'Choose Plan', 'highlight' => true],
        ['name' => 'Professional', 'price' => '₹4,999', 'period' => '/ 365 Days', 'desc' => 'Billed per month', 'features' => ['Unlimited WhatsApp Instances', 'Unlimited Contacts', 'Bulk Messaging (Unlimited Msg)', 'Campaign Management', 'API Access & Integrations', 'Media Support (Images, PDFs)', 'Analytics Reports & Logs', 'Instant Webhooks'], 'cta' => 'Choose Plan', 'highlight' => false]
    ];
    $stmtProj->execute([
        'wa-mitra',
        'WA-Mitra',
        'SaaS · Enterprise WhatsApp Gateway & API',
        '/work/wamitra.svg',
        'The Enterprise WhatsApp Gateway. Connect multiple WhatsApp instances, blast bulk campaigns, schedule automated messaging, and integrate real-time webhooks through a high-performance REST API.',
        json_encode(['WhatsApp API', 'REST Gateway', 'Node.js', 'Redis', 'Webhooks', 'PostgreSQL']),
        'https://wamitra.allysoftsolutions.com/',
        json_encode($waFeatures),
        json_encode($waPricing),
        0
    ]);

    // MyBookings
    $mbFeatures = [
        ['title' => 'Multi-Customer Management', 'desc' => 'Manage customer profiles, booking logs, and communications efficiently from one unified panel.'],
        ['title' => 'Smart Staff Scheduling', 'desc' => 'Optimize staff shifts, check real-time calendar availability, and allocate jobs automatically.'],
        ['title' => 'Real-Time Booking Updates', 'desc' => 'Instant sync blocks double-booking. Customers receive SMS updates on confirmed appointments.'],
        ['title' => 'Integrated Payments', 'desc' => 'Set up deposits or process full transactions securely with Stripe integration built-in.'],
        ['title' => 'Deep Business Analytics', 'desc' => 'Unlock charts showcasing total bookings, monthly revenue growth, and staff efficiency rates.'],
        ['title' => 'Responsive Client Portal', 'desc' => 'Clean booking interface optimized for both desktop and mobile viewports.']
    ];
    $mbPricing = [
        ['name' => 'Free', 'price' => 'Free', 'period' => '', 'desc' => 'Monthly plan', 'features' => ['2 Businesses', '1 Location', '1 Staff Member', '5 Services', '100 Bookings', '10% Payment Charge', 'Payment Integration', 'API Access', ['text' => 'Website Builder', 'disabled' => true], ['text' => 'WhatsApp Notifications', 'disabled' => true]], 'cta' => 'Activate Free', 'highlight' => false],
        ['name' => 'Starter', 'price' => '₹499', 'period' => '/ mo', 'desc' => 'Monthly plan', 'features' => ['1 Business', '1 Location', '3 Staff Members', '10 Services', '300 Bookings', '5% Payment Charge', 'Payment Integration', 'API Access', ['text' => 'Website Builder', 'disabled' => true], ['text' => 'WhatsApp Notifications', 'disabled' => true]], 'cta' => 'Choose Plan', 'highlight' => false],
        ['name' => 'Growth', 'price' => '₹999', 'period' => '/ mo', 'desc' => 'Monthly plan', 'features' => ['2 Businesses', '3 Locations', '10 Staff Members', '25 Services', '500 Bookings', '3% Payment Charge', 'Payment Integration', 'API Access', 'Website Builder', 'WhatsApp Notifications'], 'cta' => 'Choose Plan', 'highlight' => false],
        ['name' => 'Professional', 'price' => '₹1,999', 'period' => '/ mo', 'desc' => 'Monthly plan', 'features' => ['5 Businesses', '10 Locations', '25 Staff Members', '100 Services', '5000 Bookings', '2% Payment Charge', 'Payment Integration', 'API Access', 'Website Builder', 'WhatsApp Notifications'], 'cta' => 'Choose Plan', 'highlight' => false],
        ['name' => 'Enterprise', 'price' => '₹4,999', 'period' => '/ mo', 'desc' => 'Monthly plan', 'features' => ['-1 Business', '-1 Location', '-1 Staff Member', '-1 Services', 'Unlimited Bookings', '0% Platform Fee', 'Payment Integration', 'API Access', 'Website Builder', 'WhatsApp Notifications'], 'cta' => 'Choose Plan', 'highlight' => false]
    ];
    $stmtProj->execute([
        'mybookings',
        'MyBookings',
        'SaaS · Booking & Scheduling Platform',
        '/work/mybookings.png',
        'The all-in-one SaaS platform for salons, clinics, and service businesses to schedule appointments, manage staff, process payments, and grow — all from one unified dashboard.',
        json_encode(['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'SMS API', 'TailwindCSS']),
        'https://mybookings.allysoftsolutions.com/',
        json_encode($mbFeatures),
        json_encode($mbPricing),
        1
    ]);

    // Silver Touch
    $stFeatures = [
        ['title' => 'Customer Management', 'desc' => 'Maintain secure profiles, contact details, balance ledgers, and transaction histories for refiners and merchants.'],
        ['title' => 'Product Management', 'desc' => 'Track inventory of silver grains, pure silver bars, refining chemicals, and ornaments in real time.'],
        ['title' => 'Digital Receipts', 'desc' => 'Generate and print detailed transaction receipts, refining calculations, and weight breakdown invoices instantly.'],
        ['title' => 'QR Code Verification', 'desc' => 'Verify invoice integrity and check balance logs securely with anti-tamper QR code verification labels.'],
        ['title' => 'Silver Chemistry Calculations', 'desc' => 'Calculate silver purity, refining margins, melting weights, and net values with automated testing algorithms.'],
        ['title' => 'Refinery Analytics & Ledger', 'desc' => 'Unlock charts displaying daily refining volume, monthly balance sheet summaries, and business performance metrics.']
    ];
    $stPricing = [
        ['name' => 'Starter Shop', 'price' => '₹1,499', 'period' => '/ month', 'desc' => 'For local refineries & jewellers', 'features' => ['1 Refinery Branch', 'Up to 100 Customers', 'Silver Chemistry Calculator', 'Basic Email Receipts', '50 Refinery Tests / month', 'Standard Email Support'], 'cta' => 'Get Started', 'highlight' => false],
        ['name' => 'Business Pro', 'price' => '₹3,499', 'period' => '/ month', 'desc' => 'Best for busy commercial refineries', 'features' => ['5 Refinery Branches', 'Unlimited Customers', 'Bulk SMS Receipts', 'Advanced Refinery Analytics', '250 Refinery Tests / month', 'QR Code Verification', 'Priority 24/7 Support'], 'cta' => 'Recommended Plan', 'highlight' => true],
        ['name' => 'Enterprise Refinery', 'price' => '₹7,999', 'period' => '/ month', 'desc' => 'For corporate refinery networks', 'features' => ['Unlimited Refinery Branches', 'Dedicated Server Hosting', 'Customized Ledger System', 'API Integrations for POS', 'Unlimited Refinery Tests', 'Multi-user Access Control', 'Dedicated SLA Setup Support'], 'cta' => 'Choose Enterprise', 'highlight' => false]
    ];
    $stmtProj->execute([
        'silvertouch',
        'Silver Touch',
        'SaaS · Silver Refineries & Jewellery Management',
        '/work/silvertouch.png',
        'A digital platform which helps jewellers and silver refineries to manage their customers, products, receipts, and refining tests with absolute precision.',
        json_encode(['React', 'TailwindCSS', 'Node.js', 'Express', 'PostgreSQL', 'QR Verification']),
        'https://silvertouch.allysoftsolutions.com/',
        json_encode($stFeatures),
        json_encode($stPricing),
        2
    ]);

    // 8. Seed Stack Settings
    $pdo->exec("INSERT INTO stack_settings (badge, title) VALUES ('Our stack', 'Tools we trust')");

    // 9. Seed Stack items
    $stmtStack = $pdo->prepare("INSERT INTO stack (icon, title, items, sort_order) VALUES (?, ?, ?, ?)");
    $stmtStack->execute(['Monitor', 'Frontend', 'React, Next.js, Vue, Webflow, Tailwind CSS', 0]);
    $stmtStack->execute(['Server', 'Backend', 'Node.js, Express, Go, Python', 1]);
    $stmtStack->execute(['Smartphone', 'Mobile', 'Flutter, React Native, iOS, Android', 2]);
    $stmtStack->execute(['BrainCircuit', 'AI & ML', 'Python, OpenAI API, LangChain, PyTorch', 3]);
    $stmtStack->execute(['Cloud', 'Cloud & DevOps', 'AWS, Docker, Kubernetes, CI/CD', 4]);
    $stmtStack->execute(['Database', 'Databases', 'PostgreSQL, MongoDB, MySQL, Firebase', 5]);

    // 10. Seed Why Ally settings
    $pdo->exec("INSERT INTO why_ally_section (badge, title, image) VALUES (
        'Why Ally Soft', 
        'Built different, on purpose', 
        '/idea-implementation.jpg'
    )");

    // 11. Seed Why Ally Points
    $stmtWhy = $pdo->prepare("INSERT INTO why_ally_points (title, desc, sort_order) VALUES (?, ?, ?)");
    $stmtWhy->execute(['Founder Led', 'A team that thinks like owners, not just ticket-takers — decisions made with technical and business expertise.', 0]);
    $stmtWhy->execute(['Speed to Market', 'We move fast without cutting the corners that come back to bite you later.', 1]);
    $stmtWhy->execute(['Privacy, Security & Scalability', 'Built to protect your data today and hold up as you grow tomorrow.', 2]);
    $stmtWhy->execute(['AI Ready', 'Every build considers where AI can genuinely help, not where it\'s just a buzzword.', 3]);
    $stmtWhy->execute(['Transparent Comms', 'You always know what\'s shipped, what\'s next, and what\'s blocking it.', 4]);

    // 12. Seed How We Work settings
    $pdo->exec("INSERT INTO how_we_work_settings (badge, title) VALUES ('How We Work', 'Our Process')");

    // 13. Seed How We Work steps
    $stmtSteps = $pdo->prepare("INSERT INTO how_we_work_steps (n, title, desc, milestones, sort_order) VALUES (?, ?, ?, ?, ?)");
    $stmtSteps->execute([
        '01', 'Scope Light', 
        'We believe in defining the absolute smallest win that proves the point. Instead of designing a multi-month project, we break down your vision into its core utility. We focus on launching a robust, functional MVP in weeks, validating product-market fit, and removing speculative engineering overhead.',
        json_encode(['Value Mapping', 'MVP Blueprinting', 'Spec Formulation']),
        0
    ]);
    $stmtSteps->execute([
        '02', 'Ship Early', 
        'We launch a version that users can actually touch, click, and interact with as quickly as possible. Shipping code to production early changes conversations from speculative designs to actual usage feedback. We automate deployments so new updates land in minutes, not days.',
        json_encode(['CI/CD Pipelines', 'Continuous Delivery', 'Early Access Launch']),
        1
    ]);
    $stmtSteps->execute([
        '03', 'Test For Real', 
        'Listen, measure, and adjust with real usage data. We integrate deep instrumentation, performance logging, and error tracking from day one. Instead of relying on opinion, we let click streams, load times, and active user metrics guide our next development decisions.',
        json_encode(['Telemetry Setup', 'User Analytics', 'Hotfix Loop Trials']),
        2
    ]);
    $stmtSteps->execute([
        '04', 'Scale Clean', 
        'Harden, automate, and document as traffic grows. Once a feature is validated by real users, we transition it from a rapid build to a hardened service. We optimize database queries, set up Redis caching layers, refine APIs, and dockerize configurations to ensure high scalability.',
        json_encode(['Query Optimization', 'Redis Caching', 'Docker Deployment']),
        3
    ]);
    $stmtSteps->execute([
        '05', 'Grow Together', 
        'Add the right features at the right time. Product evolution is a marathon, not a sprint. We act as long-term technical partners, collaborating directly with your team to support growth spikes, maintain infrastructure stability, and plan future integrations cleanly.',
        json_encode(['Roadmap Alignment', 'Infrastructure Scaling', 'Feature Expansion']),
        4
    ]);

    // 14. Seed Why Choose Us Settings
    $pdo->exec("INSERT INTO why_choose_us_settings (badge, title) VALUES ('Why Choose Us', 'Our Commitment')");

    // 15. Seed Why Choose Us Points
    $stmtWCU = $pdo->prepare("INSERT INTO why_choose_us (icon, title, desc, sort_order) VALUES (?, ?, ?, ?)");
    $stmtWCU->execute(['Award', 'Proven Expertise', 'Over 10 years delivering successful projects across industries.', 0]);
    $stmtWCU->execute(['Clock', 'On-Time Delivery', 'We pride ourselves on meeting deadlines without cutting quality.', 1]);
    $stmtWCU->execute(['Users', 'Dedicated Team', 'Skilled professionals committed to your project\'s success.', 2]);
    $stmtWCU->execute(['Headphones', '24/7 Support', 'Round-the-clock support to keep your systems running smoothly.', 3]);
    $stmtWCU->execute(['ShieldCheck', 'Secure Solutions', 'A security-first approach to protect your data and applications.', 4]);
    $stmtWCU->execute(['TrendingUp', 'Scalable Growth', 'Solutions designed to grow alongside your business needs.', 5]);

    // 16. Seed About Section
    $stmtAbout = $pdo->prepare("INSERT INTO about_section (badge, title, desc1, desc2, experience_num, experience_label, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmtAbout->execute([
        'About us',
        'We Are Ally Soft Solutions',
        'Ally Soft Solutions started its journey in 2017 with the purpose of providing IT resources to our clients. During last two decades, we have grown from a staffing firm into a solutions and integration company. We have worked with companies of all kinds, from small and midsize businesses to Fortune 500 companies.',
        'Adapting to the latest developments in the industry, we stayed ahead of the ever changing technology curve. Implemented solutions by gaining deep understating of the business processes related to Finance, Insurance, Life Sciences, Manufacturing, Logistics, and more.',
        '10+',
        'Years Experience',
        '/logo-white.png'
    ]);

    // 17. Seed About Bullets
    $stmtBullets = $pdo->prepare("INSERT INTO about_bullets (icon, title, sort_order) VALUES (?, ?, ?)");
    $stmtBullets->execute(['Award', 'Proven Expertise', 0]);
    $stmtBullets->execute(['Clock', 'On-Time Delivery', 1]);
    $stmtBullets->execute(['Headphones', '24/7 Support', 2]);
    $stmtBullets->execute(['ShieldCheck', 'Secure Solutions', 3]);

    // 18. Seed Team Settings
    $pdo->exec("INSERT INTO team_settings (badge, title) VALUES ('Our team', 'Behind the code')");

    // 19. Seed Team items
    $stmtTeam = $pdo->prepare("INSERT INTO team (name, role, bio, tag, image, object_position, scale, transform_origin, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmtTeam->execute([
        'Vishal Akbari', 'Chief Executive Officer', 
        'Sets the company roadmap and works closely with founders to transform fuzzy project requirements into high-performing digital products.',
        'CEO & Founder', '/assets/ceo.jpg', 'center', 1.0, 'center', 0
    ]);
    $stmtTeam->execute([
        'Shamsaagazarzoo Alam', 'Chief Technology Officer', 
        'Architects scalable backend engines, cloud infrastructure, and AI microservices designed for 99.99% uptime under high traffic loads.',
        'CTO & Co-Founder', '/assets/cto.jpg', 'center', 1.0, 'center', 1
    ]);
    $stmtTeam->execute([
        'Jenil Vaghasiya', 'Junior Developer', 
        'Expertise: Mern Stack Developer. Crafts responsive, high-performance web systems and fluid backend services.',
        'Junior Dev', '/assets/jenil.jpg', 'center', 1.0, 'center', 2
    ]);
    $stmtTeam->execute([
        'Aniket Solanki', 'Junior Developer', 
        'Expertise: Mern Stack and Flutter Developer. Develops scalable server integrations and native mobile experiences.',
        'Junior Dev', '/assets/aniket.jpg', 'center 15%', 1.0, 'center', 3
    ]);
    $stmtTeam->execute([
        'Prashant Sarvaiya', 'Junior Developer', 
        'Expertise: Mern Stack and Flutter Developer. Designs secure APIs and robust cross-platform software systems.',
        'Junior Dev', '/assets/prashant.jpg', 'center 15%', 1.0, 'center', 4
    ]);
    $stmtTeam->execute([
        'Vatsal Parmar', 'Junior Developer', 
        'Expertise: Mern Stack Developer. Builds fluid user interfaces, frontend architectures, and hardware-accelerated animations.',
        'Junior Dev', '/assets/vatsal.jpg', 'center top', 1.35, 'center 15%', 5
    ]);

    // 20. Seed Contact
    $stmtContact = $pdo->prepare("INSERT INTO contact_section (title, desc, address, phone1, phone2, email, hours, owner_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmtContact->execute([
        'Get In Touch',
        'Have a project in mind? Let\'s discuss how we can help bring your ideas to life.',
        '606, 6th Floor, Shashwat World Commercial Complex, Nr. Kotharia main road, Rajkot 360022',
        '+91 7574865414',
        '+91 9023960106',
        'hr@allysoftsolutions.com',
        'Mon – Sat: 9:00 AM – 6:00 PM',
        'hr@allysoftsolutions.com'
    ]);

    // 21. Seed Footer
    $stmtFoot = $pdo->prepare("INSERT INTO footer_section (brand_name, brand_tagline, copyright, links_text, facebook_url, instagram_url, linkedin_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmtFoot->execute([
        '/logo-white.png',
        'Ally Soft Solutions builds distinctive software that empowers businesses with efficiency, security, and scalability.',
        'Ally Soft Solutions. All rights reserved.',
        'Quick Links',
        '#',
        'https://www.instagram.com/allysoftsolutions/',
        'https://www.linkedin.com/company/ally-soft-solutions/'
    ]);

    // 22. Seed Contact Info Channels
    $stmtContactInfo = $pdo->prepare("INSERT INTO contact_info (label, value, icon, sort_order) VALUES (?, ?, ?, ?)");
    $stmtContactInfo->execute(['OUR LOCATION', '606, 6th Floor, Shashwat World Commercial Complex, Nr. Kotharia main road, Rajkot 360022', 'MapPin', 0]);
    $stmtContactInfo->execute(['PHONE NUMBER', "+91 7574865414\n+91 9023960106", 'Phone', 1]);
    $stmtContactInfo->execute(['EMAIL ADDRESS', 'hr@allysoftsolutions.com', 'Mail', 2]);
    $stmtContactInfo->execute(['WORKING HOURS', 'Mon – Sat: 9:00 AM – 6:00 PM', 'Clock', 3]);

    echo "Database seeding completed successfully.\n";

} catch (Exception $e) {
    die("Database Initialization failed: " . $e->getMessage() . "\n");
}
