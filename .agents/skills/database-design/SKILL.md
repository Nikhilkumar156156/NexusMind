---
name: database-design
description: Runbook for PostgreSQL schema design, Drizzle ORM models, migration management, and caching strategies for Smart Care Navigator.
---

# Database Design Runbook: Smart Care Navigator

This skill outlines the principles, schema standards, migration protocols, and query optimization patterns for **Smart Care Navigator**.

---

## 1. Core Principles

1. **Strict Privacy by Design**: Triage sessions must never store direct patient identifiers (no patient names, phone numbers, or national IDs in `triage_sessions`).
2. **Dynamic Facility Caching**: Hospital research results gathered via Google Search MCP are cached with source citations, reducing external tool latency and API costs.
3. **Declarative Schema Migrations**: All schema updates are managed through Drizzle Kit with non-destructive, expand-and-contract migrations.

---

## 2. Table Specifications & Drizzle Schema

### 2.1 Enums
- `urgency_level`: `'CRITICAL'`, `'URGENT'`, `'NON_URGENT'`
- `specialty_mode`: `'EMERGENCY_AND_OPD'`, `'OPD_ONLY'`, `'EMERGENCY_ONLY'`, `'UNKNOWN'`
- `verification_status`: `'verified'`, `'partially_verified'`, `'unverified'`

### 2.2 Table Schemas
```typescript
import { pgTable, uuid, varchar, integer, real, text, boolean, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const urgencyEnum = pgEnum('urgency_level', ['CRITICAL', 'URGENT', 'NON_URGENT']);
export const specialtyModeEnum = pgEnum('specialty_mode', ['EMERGENCY_AND_OPD', 'OPD_ONLY', 'EMERGENCY_ONLY', 'UNKNOWN']);
export const verificationStatusEnum = pgEnum('verification_status', ['verified', 'partially_verified', 'unverified']);

// Triage Sessions (Anonymous / Session-based)
export const triageSessions = pgTable('triage_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: varchar('session_token', { length: 64 }).notNull(),
  age: integer('age').notNull(),
  sex: varchar('sex', { length: 16 }).notNull(),
  locationName: varchar('location_name', { length: 128 }).notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  primarySymptoms: text('primary_symptoms').notNull(),
  additionalSymptoms: text('additional_symptoms'),
  severity: varchar('severity', { length: 32 }).notNull(),
  duration: varchar('duration', { length: 64 }).notNull(),
  vitals: jsonb('vitals').default({}).notNull(),
  medicalHistory: jsonb('medical_history').default([]).notNull(),
  urgency: urgencyEnum('urgency').notNull(),
  emergencyRequired: boolean('emergency_required').notNull(),
  requiredSpecialty: varchar('required_specialty', { length: 64 }).notNull(),
  conditionCategory: varchar('condition_category', { length: 128 }).notNull(),
  clinicalRoutingAdvice: text('clinical_routing_advice').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Hospital Research Cache
export const hospitalResearchCache = pgTable('hospital_research_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  facilityName: varchar('facility_name', { length: 255 }).notNull(),
  normalizedName: varchar('normalized_name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  cityDistrict: varchar('city_district', { length: 128 }).notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  contactNumber: varchar('contact_number', { length: 32 }),
  hasEmergencyDepartment: boolean('has_emergency_department').default(false).notNull(),
  specialtyAvailability: jsonb('specialty_availability').default({}).notNull(),
  verificationStatus: verificationStatusEnum('verification_status').default('unverified').notNull(),
  sources: jsonb('sources').default([]).notNull(),
  lastResearchedAt: timestamp('last_researched_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Triage Recommendations
export const triageRecommendations = pgTable('triage_recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  triageSessionId: uuid('triage_session_id').references(() => triageSessions.id, { onDelete: 'cascade' }).notNull(),
  rank: integer('rank').notNull(),
  facilityId: uuid('facility_id').references(() => hospitalResearchCache.id),
  facilityName: varchar('facility_name', { length: 255 }).notNull(),
  distanceDisplay: varchar('distance_display', { length: 64 }).notNull(),
  emergencyDeptVerified: boolean('emergency_dept_verified').notNull(),
  specialtyEmergencyVerified: boolean('specialty_emergency_verified').notNull(),
  verificationStatus: verificationStatusEnum('verification_status').notNull(),
  explanation: text('explanation').notNull(),
  contactNumber: varchar('contact_number', { length: 32 }),
  navigationUri: text('navigation_uri'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

---

## 3. Migration Runbook

```bash
# Generate SQL migration from schema changes
npm run db:generate --workspace=backend

# Apply migration to database
npm run db:migrate --workspace=backend
```

### Migration Safety Rules
- Never drop columns in production without a deprecation phase.
- Always add new columns as nullable or with a default value.
- Add indexes concurrently on high-throughput columns.
