-- ============================================================
-- Database : we-do
-- Account  : sa / Password@123
-- Run      : sqlcmd -S localhost -U sa -P Password@123 -i create_tables.sql
-- ============================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'we-do')
    CREATE DATABASE [we-do];
GO

USE [we-do];
GO

-- ============================================================
-- couples
-- Created before users because users.couple_id references it.
-- created_by is nullable here; FK to users added after users exists.
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.couples') AND type = 'U')
BEGIN
    CREATE TABLE dbo.couples (
        id          NVARCHAR(36)  NOT NULL,
        invite_code NVARCHAR(6)   NOT NULL,
        created_by  NVARCHAR(36)  NOT NULL,
        created_at  DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT PK_couples PRIMARY KEY (id),
        CONSTRAINT UQ_couples_invite_code UNIQUE (invite_code)
    );

    CREATE INDEX IX_couples_invite_code ON dbo.couples (invite_code);
END
GO

-- ============================================================
-- users
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.users') AND type = 'U')
BEGIN
    CREATE TABLE dbo.users (
        id              NVARCHAR(36)  NOT NULL,
        email           NVARCHAR(255) NOT NULL,
        hashed_password NVARCHAR(255) NOT NULL,
        display_name    NVARCHAR(255) NOT NULL,
        couple_id       NVARCHAR(36)  NULL,
        created_at      DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT PK_users PRIMARY KEY (id),
        CONSTRAINT UQ_users_email UNIQUE (email),
        CONSTRAINT FK_users_couple FOREIGN KEY (couple_id) REFERENCES dbo.couples (id)
    );

    CREATE INDEX IX_users_email     ON dbo.users (email);
    CREATE INDEX IX_users_couple_id ON dbo.users (couple_id);
END
GO

-- Add FK couples.created_by -> users.id now that users table exists
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name = 'FK_couples_created_by'
      AND parent_object_id = OBJECT_ID(N'dbo.couples')
)
    ALTER TABLE dbo.couples
        ADD CONSTRAINT FK_couples_created_by FOREIGN KEY (created_by) REFERENCES dbo.users (id);
GO

-- ============================================================
-- plans
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.plans') AND type = 'U')
BEGIN
    CREATE TABLE dbo.plans (
        id           NVARCHAR(36)   NOT NULL,
        couple_id    NVARCHAR(36)   NOT NULL,
        created_by   NVARCHAR(36)   NOT NULL,
        title        NVARCHAR(255)  NOT NULL,
        description  NVARCHAR(MAX)  NULL,
        category     NVARCHAR(50)   NOT NULL DEFAULT 'other',
        target_date  DATE           NULL,
        status       NVARCHAR(20)   NOT NULL DEFAULT 'pending',
        completed_at DATETIME2      NULL,
        is_archived  BIT            NOT NULL DEFAULT 0,
        created_at   DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at   DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT PK_plans PRIMARY KEY (id),
        CONSTRAINT FK_plans_couple  FOREIGN KEY (couple_id)  REFERENCES dbo.couples (id),
        CONSTRAINT FK_plans_creator FOREIGN KEY (created_by) REFERENCES dbo.users   (id)
    );

    CREATE INDEX IX_plans_couple_id ON dbo.plans (couple_id);
END
GO

-- ============================================================
-- photos
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.photos') AND type = 'U')
BEGIN
    CREATE TABLE dbo.photos (
        id                NVARCHAR(36)  NOT NULL,
        plan_id           NVARCHAR(36)  NOT NULL,
        uploaded_by       NVARCHAR(36)  NOT NULL,
        file_path         NVARCHAR(500) NOT NULL,
        thumbnail_path    NVARCHAR(500) NOT NULL,
        original_filename NVARCHAR(255) NOT NULL,
        created_at        DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),

        CONSTRAINT PK_photos PRIMARY KEY (id),
        CONSTRAINT FK_photos_plan     FOREIGN KEY (plan_id)     REFERENCES dbo.plans (id) ON DELETE CASCADE,
        CONSTRAINT FK_photos_uploader FOREIGN KEY (uploaded_by) REFERENCES dbo.users (id)
    );

    CREATE INDEX IX_photos_plan_id ON dbo.photos (plan_id);
END
GO

PRINT 'All tables created successfully in [we-do].';
GO
