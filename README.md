# BRAXX Command Center

**Project Silo — Phase 2: Modular Brand Operating System**

A premium modular SaaS portal for BRAXX USA — an electric moto brand command center built as a founder-grade internal operating system.

## Design Language

- Light premium interface (Notion meets Linear meets creative ops)
- Modular panel architecture with workspace-driven layouts
- Editorial spacing, soft shadows, high contrast typography
- Card-driven, metric-forward, discovery-oriented
- Violet/indigo accent system on warm neutral base

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript, Turbopack)
- **Styling**: Tailwind CSS, shadcn/ui, Lucide Icons
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth/Auth.js (planned)
- **State**: Zustand, React Hook Form + Zod

## Getting Started

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Default login: `marcus@braxxusa.com` / `braxx2026!`

## Modules

| Module | Route | Purpose |
|--------|-------|---------|
| Performance | `/performance` | Executive KPIs, revenue trends, business intelligence |
| Social | `/social` | Social operations, content cadence, platform overview |
| Campaign | `/campaign` | Campaign planning, execution, linked entities |
| Partners | `/partners` | Partner network, applications, approvals |
| Operations | `/operations` | Internal workflows, tasks, process control |
| Expenses | `/expenses` | Expense tracking, approvals, cost management |
| Inventory | `/inventory` | Stock management, movement tracking, alerts |
| Content | `/content` | Creative & media hub, asset discovery, collections |
| App Activity | `/activity` | System-wide activity stream |
| Settings | `/settings` | General, Users, Roles, Permissions, Notifications |

## Architecture

```
src/
├── app/
│   ├── (admin)/              # Admin routes with sidebar layout
│   │   ├── performance/      # Business intelligence
│   │   ├── social/           # Social operations
│   │   ├── campaign/         # Campaign management
│   │   │   └── [id]/         # Campaign detail
│   │   ├── partners/         # Partner network
│   │   ├── operations/       # Internal ops
│   │   ├── expenses/         # Expense tracking
│   │   ├── inventory/        # Stock management
│   │   │   └── [id]/         # Inventory detail
│   │   ├── content/          # Creative hub
│   │   ├── activity/         # Activity stream
│   │   └── settings/         # Settings center
│   │       ├── users/        # Team members
│   │       ├── roles/        # Role management
│   │       └── ...           # Other settings pages
│   ├── (auth)/               # Auth routes
│   └── layout.tsx            # Root layout
├── components/
│   ├── admin/                # Shell components (sidebar, topbar)
│   ├── workspace/            # Shared workspace primitives
│   │   ├── MetricCard.tsx
│   │   ├── WorkspaceHeader.tsx
│   │   ├── Panel.tsx
│   │   ├── FeedItem.tsx
│   │   └── StatusDot.tsx
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── permissions.ts        # RBAC definitions
│   └── utils.ts              # Shared utilities
└── prisma/
    ├── schema.prisma         # 24 models
    └── seed.ts               # Full seed data
```

## Data Models (24 total)

**Core**: User, Role, Permission, RolePermission
**Products**: Product, ProductAsset
**Partners**: Dealer, DealerAsset, Application
**Inventory**: InventoryRecord, InventoryMovement
**Commerce**: Lead, Order
**Content**: Asset, ContentBlock
**Campaign**: Campaign, SocialPost, SocialAccount
**Operations**: OperationTask, Expense
**System**: ActivityLog, Note, Tag, RecordTag

## RBAC

7 roles with module-level permissions across 10 modules and 9 action types.

## Future Phases

- **Phase 3**: Performance HQ charts, real-time social integrations
- **Phase 4**: Logistics HQ, Support HQ, advanced reporting
