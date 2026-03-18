import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BRAXX Admin database...\n");

  // ── ROLES ──────────────────────────────────────────────────
  console.log("Creating roles...");
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "Super Admin" },
      update: {},
      create: { name: "Super Admin", description: "Full system access with all permissions" },
    }),
    prisma.role.upsert({
      where: { name: "Founder Admin" },
      update: {},
      create: { name: "Founder Admin", description: "Founder-level access to all business operations" },
    }),
    prisma.role.upsert({
      where: { name: "Operations Manager" },
      update: {},
      create: { name: "Operations Manager", description: "Manages inventory, orders, and day-to-day operations" },
    }),
    prisma.role.upsert({
      where: { name: "Sales Manager" },
      update: {},
      create: { name: "Sales Manager", description: "Manages leads, orders, and dealer relationships" },
    }),
    prisma.role.upsert({
      where: { name: "Dealer Manager" },
      update: {},
      create: { name: "Dealer Manager", description: "Manages dealer network and applications" },
    }),
    prisma.role.upsert({
      where: { name: "Content Manager" },
      update: {},
      create: { name: "Content Manager", description: "Manages site content and media assets" },
    }),
    prisma.role.upsert({
      where: { name: "Analyst Read Only" },
      update: {},
      create: { name: "Analyst Read Only", description: "View-only access to dashboards and reports" },
    }),
  ]);

  const [superAdmin, founderAdmin, opsManager, salesManager, dealerManager, contentManager, analystReadOnly] = roles;

  // ── PERMISSIONS ────────────────────────────────────────────
  console.log("Creating permissions...");
  const modules = [
    "dashboard", "products", "dealers", "applications", "inventory",
    "leads", "orders", "media", "content", "activity_log", "users", "settings",
  ];
  const actions = [
    "view", "create", "edit", "delete", "approve", "publish", "export", "manage_users", "manage_roles",
  ];

  const permissions: Array<{ id: string; key: string; module: string }> = [];
  for (const mod of modules) {
    for (const act of actions) {
      const key = `${mod}:${act}`;
      const label = `${act.charAt(0).toUpperCase() + act.slice(1).replace(/_/g, " ")} ${mod.replace(/_/g, " ")}`;
      const perm = await prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key, label, module: mod },
      });
      permissions.push(perm);
    }
  }

  // ── ROLE PERMISSIONS ───────────────────────────────────────
  console.log("Assigning role permissions...");

  const allPermIds = permissions.map((p) => p.id);

  // Super Admin & Founder Admin get everything
  for (const role of [superAdmin, founderAdmin]) {
    for (const permId of allPermIds) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permId } },
        update: {},
        create: { roleId: role.id, permissionId: permId },
      });
    }
  }

  // Operations Manager
  const opsModules = ["dashboard", "products", "inventory", "orders", "activity_log"];
  const opsActions = ["view", "create", "edit", "delete", "export"];
  for (const perm of permissions) {
    const [mod, act] = perm.key.split(":");
    if (opsModules.includes(mod) && opsActions.includes(act)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: opsManager.id, permissionId: perm.id } },
        update: {},
        create: { roleId: opsManager.id, permissionId: perm.id },
      });
    }
  }

  // Sales Manager
  const salesModules = ["dashboard", "products", "dealers", "leads", "orders", "activity_log"];
  const salesActions = ["view", "create", "edit", "export", "approve"];
  for (const perm of permissions) {
    const [mod, act] = perm.key.split(":");
    if (salesModules.includes(mod) && salesActions.includes(act)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: salesManager.id, permissionId: perm.id } },
        update: {},
        create: { roleId: salesManager.id, permissionId: perm.id },
      });
    }
  }

  // Dealer Manager
  const dealerModules = ["dashboard", "dealers", "applications", "inventory", "activity_log"];
  const dealerActions = ["view", "create", "edit", "approve", "export"];
  for (const perm of permissions) {
    const [mod, act] = perm.key.split(":");
    if (dealerModules.includes(mod) && dealerActions.includes(act)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: dealerManager.id, permissionId: perm.id } },
        update: {},
        create: { roleId: dealerManager.id, permissionId: perm.id },
      });
    }
  }

  // Content Manager
  const contentModules = ["dashboard", "products", "media", "content", "activity_log"];
  const contentActions = ["view", "create", "edit", "publish"];
  for (const perm of permissions) {
    const [mod, act] = perm.key.split(":");
    if (contentModules.includes(mod) && contentActions.includes(act)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: contentManager.id, permissionId: perm.id } },
        update: {},
        create: { roleId: contentManager.id, permissionId: perm.id },
      });
    }
  }

  // Analyst Read Only
  const analystModules = ["dashboard", "products", "dealers", "inventory", "leads", "orders", "activity_log"];
  for (const perm of permissions) {
    const [mod, act] = perm.key.split(":");
    if (analystModules.includes(mod) && (act === "view" || act === "export")) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: analystReadOnly.id, permissionId: perm.id } },
        update: {},
        create: { roleId: analystReadOnly.id, permissionId: perm.id },
      });
    }
  }

  // ── USERS ──────────────────────────────────────────────────
  console.log("Creating users...");
  const passwordHash = await hash("braxx2026!", 12);

  const marcus = await prisma.user.upsert({
    where: { email: "marcus@braxxusa.com" },
    update: {},
    create: {
      fullName: "Marcus Chen",
      email: "marcus@braxxusa.com",
      passwordHash,
      roleId: founderAdmin.id,
      isActive: true,
      lastLoginAt: new Date("2026-03-17T14:30:00Z"),
    },
  });

  const sarah = await prisma.user.upsert({
    where: { email: "sarah@braxxusa.com" },
    update: {},
    create: {
      fullName: "Sarah Kim",
      email: "sarah@braxxusa.com",
      passwordHash,
      roleId: salesManager.id,
      isActive: true,
      lastLoginAt: new Date("2026-03-17T12:15:00Z"),
    },
  });

  const alex = await prisma.user.upsert({
    where: { email: "alex@braxxusa.com" },
    update: {},
    create: {
      fullName: "Alex Torres",
      email: "alex@braxxusa.com",
      passwordHash,
      roleId: opsManager.id,
      isActive: true,
      lastLoginAt: new Date("2026-03-17T10:00:00Z"),
    },
  });

  const jamie = await prisma.user.upsert({
    where: { email: "jamie@braxxusa.com" },
    update: {},
    create: {
      fullName: "Jamie Foster",
      email: "jamie@braxxusa.com",
      passwordHash,
      roleId: contentManager.id,
      isActive: true,
      lastLoginAt: new Date("2026-03-16T09:00:00Z"),
    },
  });

  const drew = await prisma.user.upsert({
    where: { email: "drew@braxxusa.com" },
    update: {},
    create: {
      fullName: "Drew Patel",
      email: "drew@braxxusa.com",
      passwordHash,
      roleId: dealerManager.id,
      isActive: true,
      lastLoginAt: new Date("2026-03-15T16:30:00Z"),
    },
  });

  await prisma.user.upsert({
    where: { email: "robin@braxxusa.com" },
    update: {},
    create: {
      fullName: "Robin Nakamura",
      email: "robin@braxxusa.com",
      passwordHash,
      roleId: analystReadOnly.id,
      isActive: false,
      lastLoginAt: new Date("2026-02-20T14:00:00Z"),
    },
  });

  // ── PRODUCTS ───────────────────────────────────────────────
  console.log("Creating products...");
  const gt = await prisma.product.upsert({
    where: { slug: "braxx-gt" },
    update: {},
    create: {
      name: "BRAXX GT",
      slug: "braxx-gt",
      model: "GT",
      sku: "BX-GT-001",
      category: "Electric Moto",
      description: "The BRAXX GT is the foundation of electric moto performance. Engineered for riders who demand reliability, range, and razor-sharp handling at an accessible price point.",
      shortDescription: "Foundation electric moto performance",
      status: "active",
      price: 8499,
      compareAtPrice: 9499,
      cost: 4800,
      battery: "60V 35Ah Lithium-Ion",
      power: "5000W Peak",
      topSpeed: "65 mph",
      range: "85 miles",
      wheelSize: "17\" Front / 17\" Rear",
      suspension: "Inverted Fork / Mono Shock",
      brakes: "Dual Disc Hydraulic",
      weight: "245 lbs",
      colorways: ["Stealth Black", "Arctic White", "Gunmetal Gray"],
      specs: { motor: "Brushless DC Hub", chargeTime: "4-6 hours", display: "5\" TFT LCD" },
      featured: true,
      preorder: false,
      inventoryCount: 45,
      publishToSite: true,
      createdById: marcus.id,
      updatedById: marcus.id,
    },
  });

  const gtPro = await prisma.product.upsert({
    where: { slug: "braxx-gt-pro" },
    update: {},
    create: {
      name: "BRAXX GT Pro",
      slug: "braxx-gt-pro",
      model: "GT Pro",
      sku: "BX-GTP-001",
      category: "Electric Moto",
      description: "The BRAXX GT Pro represents the pinnacle of electric moto performance. Built for riders who demand more power, more range, and more control.",
      shortDescription: "Peak performance electric moto",
      status: "active",
      price: 12999,
      compareAtPrice: 14999,
      cost: 7200,
      battery: "72V 45Ah Lithium-Ion",
      power: "8000W Peak",
      topSpeed: "85 mph",
      range: "120 miles",
      wheelSize: "19\" Front / 17\" Rear",
      suspension: "Fully Adjustable Inverted Fork / Mono Shock",
      brakes: "Dual Disc Hydraulic / Regenerative",
      weight: "285 lbs",
      colorways: ["Stealth Black", "Arctic White", "Matte Black"],
      specs: { motor: "Brushless DC Mid-Drive", chargeTime: "5-7 hours", display: "7\" TFT Touchscreen" },
      featured: true,
      preorder: false,
      inventoryCount: 28,
      publishToSite: true,
      createdById: marcus.id,
      updatedById: marcus.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "braxx-gt-sport" },
    update: {},
    create: {
      name: "BRAXX GT Sport",
      slug: "braxx-gt-sport",
      model: "GT Sport",
      sku: "BX-GTS-001",
      category: "Electric Moto",
      description: "The BRAXX GT Sport bridges the gap between the GT and GT Pro. Tuned for aggressive street riding with sport-oriented geometry.",
      shortDescription: "Sport-tuned electric moto",
      status: "draft",
      price: 10499,
      cost: 5900,
      battery: "72V 40Ah Lithium-Ion",
      power: "6500W Peak",
      topSpeed: "75 mph",
      range: "100 miles",
      wheelSize: "17\" Front / 17\" Rear",
      suspension: "Sport-Tuned Inverted Fork / Mono Shock",
      brakes: "Dual Disc Hydraulic / Regenerative",
      weight: "260 lbs",
      colorways: ["Racing Red", "Stealth Black"],
      featured: false,
      preorder: false,
      inventoryCount: 0,
      publishToSite: false,
      createdById: marcus.id,
    },
  });

  const battery = await prisma.product.upsert({
    where: { slug: "braxx-battery-pack" },
    update: {},
    create: {
      name: "BRAXX Battery Pack",
      slug: "braxx-battery-pack",
      model: "Accessory",
      sku: "BX-BAT-001",
      category: "Accessories",
      description: "Replacement and spare battery pack compatible with all BRAXX GT series models.",
      shortDescription: "Spare battery pack for GT series",
      status: "active",
      price: 1299,
      cost: 680,
      battery: "60V 35Ah Lithium-Ion",
      weight: "22 lbs",
      featured: false,
      preorder: false,
      inventoryCount: 120,
      publishToSite: true,
      createdById: marcus.id,
    },
  });

  // ── DEALERS ────────────────────────────────────────────────
  console.log("Creating dealers...");
  const dealerData = [
    { name: "True Motion Cycles", city: "Los Angeles", state: "CA", address1: "4521 Sunset Blvd", zip: "90027", contactName: "Jake Morrison", phone: "(310) 555-0142", email: "jake@truemotion.com", website: "https://truemotioncycles.com", status: "active" as const, featured: true, publicVisibility: true, productTypes: ["GT", "GT Pro"] },
    { name: "Volt City Motors", city: "San Francisco", state: "CA", address1: "890 Market St", zip: "94102", contactName: "Lisa Chen", phone: "(415) 555-0198", email: "lisa@voltcity.com", website: "https://voltcitymotors.com", status: "active" as const, featured: false, publicVisibility: true, productTypes: ["GT"] },
    { name: "Thunder Road EV", city: "Austin", state: "TX", address1: "2100 South Congress Ave", zip: "78704", contactName: "Mike Torres", phone: "(512) 555-0167", email: "mike@thunderroad.com", website: "https://thunderroadev.com", status: "onboarding" as const, featured: false, publicVisibility: false, productTypes: ["GT", "GT Pro"] },
    { name: "Pacific Electric", city: "Portland", state: "OR", address1: "1455 NW 23rd Ave", zip: "97210", contactName: "Amy Walsh", phone: "(503) 555-0134", email: "amy@pacificelectric.com", website: "https://pacificelectric.com", status: "active" as const, featured: true, publicVisibility: true, productTypes: ["GT", "GT Pro", "Accessories"] },
    { name: "Metro EV Hub", city: "Chicago", state: "IL", address1: "742 N Michigan Ave", zip: "60611", contactName: "Dan Roberts", phone: "(312) 555-0189", email: "dan@metroev.com", status: "prospect" as const, featured: false, publicVisibility: false, productTypes: [] },
    { name: "Sunset Riders", city: "Miami", state: "FL", address1: "325 Ocean Dr", zip: "33139", contactName: "Carlos Vega", phone: "(305) 555-0156", email: "carlos@sunsetriders.com", website: "https://sunsetriders.com", status: "active" as const, featured: false, publicVisibility: true, productTypes: ["GT"] },
    { name: "Peak Performance EV", city: "Denver", state: "CO", address1: "1800 Blake St", zip: "80202", contactName: "Rachel Kim", phone: "(720) 555-0171", email: "rachel@peakperformance.com", status: "onboarding" as const, featured: false, publicVisibility: false, productTypes: ["GT Pro"] },
    { name: "Empire Electric", city: "New York", state: "NY", address1: "550 Broadway", zip: "10012", contactName: "James Liu", phone: "(212) 555-0143", email: "james@empireelectric.com", website: "https://empireelectric.com", status: "active" as const, featured: true, publicVisibility: true, productTypes: ["GT", "GT Pro", "Accessories"] },
  ];

  for (const d of dealerData) {
    await prisma.dealer.upsert({
      where: { id: d.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") },
      update: {},
      create: {
        name: d.name,
        address1: d.address1,
        city: d.city,
        state: d.state,
        zip: d.zip,
        country: "US",
        contactName: d.contactName,
        phone: d.phone,
        email: d.email,
        website: d.website,
        status: d.status,
        featured: d.featured,
        publicVisibility: d.publicVisibility,
        productTypes: d.productTypes,
        createdById: marcus.id,
      },
    });
  }

  // ── APPLICATIONS ───────────────────────────────────────────
  console.log("Creating applications...");
  const appData = [
    { applicationType: "dealer" as const, fullName: "Jordan Lee", email: "jordan@evmoto.com", company: "EV Moto Works", city: "Seattle", state: "WA", status: "new" as const, source: "website", message: "We are a premium motorcycle dealership in Seattle and would love to carry the BRAXX GT series. Our showroom sees 200+ visitors per week." },
    { applicationType: "dealer" as const, fullName: "Maria Santos", email: "maria@rideon.com", company: "Ride On Electric", city: "Phoenix", state: "AZ", status: "in_review" as const, source: "referral", message: "Referred by Pacific Electric. Looking to become an authorized BRAXX dealer in the Southwest market." },
    { applicationType: "ambassador" as const, fullName: "Tyler Brooks", email: "tyler@gmail.com", city: "Nashville", state: "TN", status: "new" as const, source: "instagram", message: "I'm a content creator with 45K followers focused on electric vehicles and urban mobility. Would love to represent BRAXX." },
    { applicationType: "dealer" as const, fullName: "Priya Patel", email: "priya@greenwheel.com", company: "Green Wheel Motors", city: "Atlanta", state: "GA", status: "approved" as const, source: "website", message: "Established EV dealership with 5 years of operation. Ready to onboard BRAXX products immediately." },
    { applicationType: "corporate" as const, fullName: "David Chen", email: "david.chen@techfleet.com", company: "TechFleet Solutions", city: "San Jose", state: "CA", status: "follow_up_needed" as const, source: "trade_show", message: "Interested in fleet pricing for our campus mobility program. Looking at 20-50 units." },
    { applicationType: "partner" as const, fullName: "Emma Williams", email: "emma@chargepoint.com", company: "ChargePoint", city: "Campbell", state: "CA", status: "in_review" as const, source: "email", message: "Exploring partnership opportunities for integrated charging solutions with BRAXX vehicles." },
    { applicationType: "dealer" as const, fullName: "Robert Kim", email: "robert@kimsmotors.com", company: "Kim's Motors", city: "Houston", state: "TX", status: "rejected" as const, source: "website", message: "Small shop looking to add electric motos to our lineup." },
    { applicationType: "ambassador" as const, fullName: "Aisha Johnson", email: "aisha@ride.social", city: "Detroit", state: "MI", status: "new" as const, source: "tiktok", message: "Professional rider and social media influencer. 120K on TikTok. Based in the Motor City." },
    { applicationType: "tech_support" as const, fullName: "Carlos Mendez", email: "carlos@fixev.com", company: "FixEV Certified", city: "Dallas", state: "TX", status: "approved" as const, source: "website", message: "Certified EV mechanic shop. Can provide authorized service and warranty work for BRAXX products in DFW." },
    { applicationType: "dealer" as const, fullName: "Sarah Thompson", email: "sarah@ridersden.com", company: "Rider's Den", city: "Charlotte", state: "NC", status: "new" as const, source: "website", message: "Premium motorcycle shop expanding into electric. Prime location on South Blvd with high traffic." },
    { applicationType: "corporate" as const, fullName: "Jason Park", email: "jason@deliverfast.com", company: "DeliverFast", city: "Minneapolis", state: "MN", status: "follow_up_needed" as const, source: "website", message: "Last-mile delivery company interested in BRAXX for our courier fleet. Need pricing for 30+ units." },
    { applicationType: "partner" as const, fullName: "Nina Volkov", email: "nina@evparts.com", company: "EV Parts Direct", city: "Portland", state: "OR", status: "archived" as const, source: "trade_show", message: "Parts distributor interested in carrying BRAXX OEM and aftermarket components." },
  ];

  for (const a of appData) {
    const existing = await prisma.application.findFirst({ where: { email: a.email } });
    if (!existing) {
      await prisma.application.create({
        data: {
          applicationType: a.applicationType,
          fullName: a.fullName,
          email: a.email,
          company: a.company,
          city: a.city,
          state: a.state,
          status: a.status,
          source: a.source,
          message: a.message,
          ownerId: a.status !== "new" ? sarah.id : undefined,
        },
      });
    }
  }

  // ── INVENTORY RECORDS ──────────────────────────────────────
  console.log("Creating inventory records...");
  const inventoryData = [
    { product: gt, variant: "Stealth Black", location: "Main Warehouse", locationType: "warehouse" as const, available: 18, reserved: 3, sold: 24, incoming: 10, threshold: 10 },
    { product: gt, variant: "Arctic White", location: "Main Warehouse", locationType: "warehouse" as const, available: 12, reserved: 2, sold: 18, incoming: 5, threshold: 10 },
    { product: gt, variant: "Gunmetal Gray", location: "Main Warehouse", locationType: "warehouse" as const, available: 8, reserved: 1, sold: 12, incoming: 0, threshold: 10 },
    { product: gtPro, variant: "Stealth Black", location: "Main Warehouse", locationType: "warehouse" as const, available: 10, reserved: 4, sold: 14, incoming: 8, threshold: 10 },
    { product: gtPro, variant: "Arctic White", location: "Main Warehouse", locationType: "warehouse" as const, available: 6, reserved: 2, sold: 8, incoming: 5, threshold: 10 },
    { product: gtPro, variant: "Matte Black", location: "Main Warehouse", locationType: "warehouse" as const, available: 3, reserved: 1, sold: 6, incoming: 0, threshold: 10 },
    { product: battery, variant: "Standard", location: "Main Warehouse", locationType: "warehouse" as const, available: 85, reserved: 10, sold: 45, incoming: 30, threshold: 20 },
    { product: gt, variant: "Stealth Black", location: "True Motion Cycles", locationType: "dealer" as const, available: 2, reserved: 0, sold: 3, incoming: 1, threshold: 2 },
    { product: gtPro, variant: "Stealth Black", location: "Empire Electric", locationType: "dealer" as const, available: 1, reserved: 1, sold: 2, incoming: 0, threshold: 2 },
    { product: battery, variant: "Standard", location: "Pacific Electric", locationType: "dealer" as const, available: 5, reserved: 0, sold: 8, incoming: 3, threshold: 3 },
  ];

  const inventoryRecords = [];
  for (const inv of inventoryData) {
    const record = await prisma.inventoryRecord.create({
      data: {
        productId: inv.product.id,
        locationName: inv.location,
        locationType: inv.locationType,
        variant: inv.variant,
        availableUnits: inv.available,
        reservedUnits: inv.reserved,
        soldUnits: inv.sold,
        incomingUnits: inv.incoming,
        reorderThreshold: inv.threshold,
      },
    });
    inventoryRecords.push(record);
  }

  // ── INVENTORY MOVEMENTS ────────────────────────────────────
  console.log("Creating inventory movements...");
  const criticalRecord = inventoryRecords[5]; // GT Pro Matte Black
  const movements = [
    { type: "sell" as const, qty: -2, ref: "ORD-2026-042", by: sarah.id, date: new Date("2026-03-15") },
    { type: "reserve" as const, qty: -1, ref: "ORD-2026-039", by: null, date: new Date("2026-03-12") },
    { type: "receive" as const, qty: 4, ref: "PO-2026-018", by: alex.id, date: new Date("2026-03-01") },
    { type: "adjust" as const, qty: -1, ref: "Damage - shipping", by: alex.id, date: new Date("2026-02-25") },
    { type: "sell" as const, qty: -3, ref: "ORD-2026-031", by: sarah.id, date: new Date("2026-02-20") },
    { type: "receive" as const, qty: 6, ref: "PO-2026-012", by: alex.id, date: new Date("2026-02-10") },
  ];

  for (const m of movements) {
    await prisma.inventoryMovement.create({
      data: {
        inventoryRecordId: criticalRecord.id,
        movementType: m.type,
        quantity: m.qty,
        reference: m.ref,
        performedById: m.by,
        createdAt: m.date,
      },
    });
  }

  // ── ACTIVITY LOG ───────────────────────────────────────────
  console.log("Creating activity log entries...");
  const activityData = [
    { actor: marcus.id, action: "published", module: "products", summary: "Published product BRAXX GT Pro to site", date: new Date("2026-03-17T14:30:00Z") },
    { actor: sarah.id, action: "approved", module: "applications", summary: "Approved dealer application from Priya Patel (Green Wheel Motors)", date: new Date("2026-03-17T12:15:00Z") },
    { actor: alex.id, action: "adjusted", module: "inventory", summary: "Adjusted inventory for GT Pro Matte Black: +4 units received", date: new Date("2026-03-17T10:00:00Z") },
    { actor: marcus.id, action: "created", module: "products", summary: "Created new product: BRAXX GT Sport (draft)", date: new Date("2026-03-16T16:45:00Z") },
    { actor: sarah.id, action: "updated", module: "dealers", summary: "Updated dealer status: Thunder Road EV moved to Onboarding", date: new Date("2026-03-16T14:20:00Z") },
    { actor: null, action: "submitted", module: "applications", summary: "New dealer application submitted from EV Moto Works", date: new Date("2026-03-15T09:30:00Z") },
    { actor: null, action: "flagged", module: "inventory", summary: "Auto-flagged low stock alert: GT Pro Matte Black (3 units)", date: new Date("2026-03-15T08:00:00Z") },
    { actor: marcus.id, action: "updated", module: "content", summary: "Updated site content: Hero Section copy", date: new Date("2026-03-14T17:00:00Z") },
    { actor: sarah.id, action: "created", module: "dealers", summary: "Added new dealer: Metro EV Hub (Chicago, IL) as prospect", date: new Date("2026-03-14T11:30:00Z") },
    { actor: alex.id, action: "sold", module: "inventory", summary: "Recorded sale: 2x GT Pro Stealth Black (ORD-2026-042)", date: new Date("2026-03-13T15:45:00Z") },
    { actor: null, action: "submitted", module: "applications", summary: "New ambassador application from Tyler Brooks (Nashville, TN)", date: new Date("2026-03-13T10:15:00Z") },
    { actor: marcus.id, action: "edited", module: "products", summary: "Updated pricing for BRAXX GT: $8,499", date: new Date("2026-03-12T14:00:00Z") },
    { actor: sarah.id, action: "rejected", module: "applications", summary: "Rejected dealer application from Robert Kim (Kim's Motors)", date: new Date("2026-03-11T16:30:00Z") },
    { actor: null, action: "received", module: "inventory", summary: "Auto-logged PO-2026-018 receipt: 4x GT Pro Matte Black", date: new Date("2026-03-10T09:00:00Z") },
    { actor: marcus.id, action: "published", module: "dealers", summary: "Made Empire Electric dealer profile visible on site", date: new Date("2026-03-09T13:20:00Z") },
  ];

  for (const a of activityData) {
    await prisma.activityLog.create({
      data: {
        actorId: a.actor,
        action: a.action,
        module: a.module,
        summary: a.summary,
        createdAt: a.date,
      },
    });
  }

  // ── LEADS ──────────────────────────────────────────────────
  console.log("Creating leads...");
  const leadData = [
    { fullName: "Michael Rivera", company: "Rivera Motors", email: "michael@riveramotors.com", phone: "(619) 555-0128", city: "San Diego", state: "CA", source: "website", interest: "Dealership", productInterest: "GT Pro", stage: "qualified" as const, assignedTo: sarah.id },
    { fullName: "Amanda Foster", company: "Urban Rides Inc", email: "amanda@urbanrides.com", phone: "(503) 555-0145", city: "Portland", state: "OR", source: "trade_show", interest: "Fleet Purchase", productInterest: "GT", stage: "negotiating" as const, assignedTo: sarah.id },
    { fullName: "Kevin Zhang", email: "kevin.zhang@gmail.com", phone: "(415) 555-0167", city: "San Francisco", state: "CA", source: "instagram", interest: "Personal Purchase", productInterest: "GT Pro", stage: "new" as const },
    { fullName: "Diana Okonkwo", company: "GreenPath Delivery", email: "diana@greenpath.com", phone: "(404) 555-0189", city: "Atlanta", state: "GA", source: "website", interest: "Fleet Purchase", productInterest: "GT", budgetRange: "$150,000 - $250,000", stage: "contacted" as const, assignedTo: sarah.id },
  ];

  for (const l of leadData) {
    const existing = await prisma.lead.findFirst({ where: { email: l.email } });
    if (!existing) {
      await prisma.lead.create({
        data: {
          fullName: l.fullName,
          company: l.company,
          email: l.email,
          phone: l.phone,
          city: l.city,
          state: l.state,
          source: l.source,
          interest: l.interest,
          productInterest: l.productInterest,
          budgetRange: l.budgetRange,
          stage: l.stage,
          assignedToId: l.assignedTo,
        },
      });
    }
  }

  // ── ORDERS ─────────────────────────────────────────────────
  console.log("Creating orders...");
  const orderData = [
    { orderNumber: "ORD-2026-042", customerName: "James Liu", customerEmail: "james@empireelectric.com", productId: gtPro.id, model: "GT Pro", quantity: 2, revenue: 25998, cost: 14400, margin: 11598, paymentStatus: "paid", fulfillmentStatus: "shipped", shippingStatus: "in_transit", trackingNumber: "1Z999AA10123456784", saleType: "dealer", sourceChannel: "direct" },
    { orderNumber: "ORD-2026-039", customerName: "Jake Morrison", customerEmail: "jake@truemotion.com", productId: gt.id, model: "GT", quantity: 3, revenue: 25497, cost: 14400, margin: 11097, paymentStatus: "paid", fulfillmentStatus: "delivered", saleType: "dealer", sourceChannel: "direct" },
    { orderNumber: "ORD-2026-031", customerName: "Amy Walsh", customerEmail: "amy@pacificelectric.com", productId: gtPro.id, model: "GT Pro", quantity: 3, revenue: 38997, cost: 21600, margin: 17397, paymentStatus: "paid", fulfillmentStatus: "delivered", saleType: "dealer", sourceChannel: "direct" },
  ];

  for (const o of orderData) {
    const existing = await prisma.order.findFirst({ where: { orderNumber: o.orderNumber } });
    if (!existing) {
      await prisma.order.create({
        data: {
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          productId: o.productId,
          model: o.model,
          quantity: o.quantity,
          revenue: o.revenue,
          cost: o.cost,
          margin: o.margin,
          paymentStatus: o.paymentStatus,
          fulfillmentStatus: o.fulfillmentStatus,
          shippingStatus: o.shippingStatus,
          trackingNumber: o.trackingNumber,
          saleType: o.saleType,
          sourceChannel: o.sourceChannel,
          assignedRepId: sarah.id,
        },
      });
    }
  }

  console.log("\nSeed complete!");
  console.log("──────────────────────────────────────────");
  console.log("Users created: 6");
  console.log("Roles created: 7");
  console.log("Permissions created:", permissions.length);
  console.log("Products created: 4");
  console.log("Dealers created:", dealerData.length);
  console.log("Applications created:", appData.length);
  console.log("Inventory records created:", inventoryData.length);
  console.log("Activity log entries created:", activityData.length);
  console.log("Leads created:", leadData.length);
  console.log("Orders created:", orderData.length);
  console.log("──────────────────────────────────────────");
  console.log("\nDefault login: marcus@braxxusa.com / braxx2026!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
