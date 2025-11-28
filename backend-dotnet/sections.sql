CREATE TABLE academic.sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(50) NOT NULL,
    class_id uuid NOT NULL REFERENCES academic.classes(id) ON DELETE CASCADE,
    tenant_id uuid NOT NULL,
    created_at timestamptz DEFAULT NOW(),
    updated_at timestamptz DEFAULT NOW(),
    is_active boolean DEFAULT true
);
CREATE UNIQUE INDEX ux_sections_tenant_class_name ON academic.sections (tenant_id, class_id, name);
