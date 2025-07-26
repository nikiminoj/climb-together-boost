
import { pgTable, uuid, varchar, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const appRoleEnum = pgEnum('app_role', ['admin', 'moderator', 'user']);

// Tables
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  username: text('username'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug'),
  description: text('description'),
  icon: text('icon'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey(),
  name: varchar('name').notNull(),
  description: text('description'),
  image: varchar('image'),
  author: varchar('author'),
  upvotes: integer('upvotes').default(0),
  points: integer('points').default(0),
  peerPushPoints: integer('peer_push_points').default(0),
  badges: text('badges').array(),
  category: varchar('category'),
  link: varchar('link'),
  userId: uuid('user_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const badges = pgTable('badges', {
  id: uuid('id').primaryKey(),
  name: varchar('name').notNull(),
  description: text('description'),
  icon: varchar('icon'),
});

export const userBadges = pgTable('user_badges', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id'),
  badgeId: uuid('badge_id'),
  earnedAt: timestamp('earned_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id'),
  message: text('message').notNull(),
  type: varchar('type').notNull(),
  read: boolean('read').default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productUpvotes = pgTable('product_upvotes', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id'),
  productId: uuid('product_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
});

export const productTags = pgTable('product_tags', {
  productId: uuid('product_id').notNull(),
  tagId: uuid('tag_id').notNull(),
});

export const userRoles = pgTable('user_roles', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  role: appRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));

export const productTagsRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));
