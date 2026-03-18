export const MODULES = [
  "performance",
  "social",
  "campaign",
  "partners",
  "operations",
  "expenses",
  "inventory",
  "content",
  "app_activity",
  "settings",
] as const;

export type Module = (typeof MODULES)[number];

export const ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
  "publish",
  "export",
  "manage_users",
  "manage_roles",
] as const;

export type Action = (typeof ACTIONS)[number];

export function permissionKey(module: Module, action: Action): string {
  return `${module}:${action}`;
}

export const DEFAULT_ROLES = {
  super_admin: {
    name: "Super Admin",
    description: "Full system access with all permissions",
  },
  founder_admin: {
    name: "Founder Admin",
    description: "Founder-level access to all business operations",
  },
  operations_manager: {
    name: "Operations Manager",
    description: "Manages inventory, operations, and day-to-day workflows",
  },
  sales_manager: {
    name: "Sales Manager",
    description: "Manages partners, campaigns, and revenue operations",
  },
  dealer_manager: {
    name: "Dealer Manager",
    description: "Manages partner network and applications",
  },
  content_manager: {
    name: "Content Manager",
    description: "Manages content, social, and creative assets",
  },
  analyst_read_only: {
    name: "Analyst Read Only",
    description: "View-only access to dashboards and reports",
  },
} as const;

export type RoleKey = keyof typeof DEFAULT_ROLES;

type RolePermissionMap = Record<RoleKey, { modules: Module[]; actions: Action[] }>;

export const ROLE_PERMISSIONS: RolePermissionMap = {
  super_admin: {
    modules: [...MODULES],
    actions: [...ACTIONS],
  },
  founder_admin: {
    modules: [...MODULES],
    actions: [...ACTIONS],
  },
  operations_manager: {
    modules: ["performance", "operations", "inventory", "expenses", "app_activity"],
    actions: ["view", "create", "edit", "delete", "export"],
  },
  sales_manager: {
    modules: ["performance", "partners", "campaign", "expenses", "app_activity"],
    actions: ["view", "create", "edit", "export", "approve"],
  },
  dealer_manager: {
    modules: ["performance", "partners", "inventory", "app_activity"],
    actions: ["view", "create", "edit", "approve", "export"],
  },
  content_manager: {
    modules: ["performance", "social", "campaign", "content", "app_activity"],
    actions: ["view", "create", "edit", "publish"],
  },
  analyst_read_only: {
    modules: ["performance", "partners", "inventory", "campaign", "app_activity"],
    actions: ["view", "export"],
  },
};

export interface UserPermissions {
  permissions: string[];
}

export function hasPermission(
  userPermissions: string[],
  module: Module,
  action: Action
): boolean {
  const key = permissionKey(module, action);
  return userPermissions.includes(key);
}

export function canAccessModule(
  userPermissions: string[],
  module: Module
): boolean {
  return userPermissions.some((p) => p.startsWith(`${module}:`));
}

export function getModuleActions(
  userPermissions: string[],
  module: Module
): Action[] {
  return userPermissions
    .filter((p) => p.startsWith(`${module}:`))
    .map((p) => p.split(":")[1] as Action);
}
