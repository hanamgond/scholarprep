using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations.Academic
{
    /// <inheritdoc />
    public partial class InitAcademic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "academic");

            migrationBuilder.CreateTable(
                name: "classes",
                schema: "academic",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    campus_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_classes", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sections",
                schema: "academic",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    class_id = table.Column<Guid>(type: "uuid", nullable: false),
                    campus_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sections", x => x.id);
                    table.ForeignKey(
                        name: "fk_sections_classes_class_id",
                        column: x => x.class_id,
                        principalSchema: "academic",
                        principalTable: "classes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "students",
                schema: "academic",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    campus_id = table.Column<Guid>(type: "uuid", nullable: false),
                    class_id = table.Column<Guid>(type: "uuid", nullable: false),
                    section_id = table.Column<Guid>(type: "uuid", nullable: false),
                    first_name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    last_name = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    admission_no = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    phone = table.Column<string>(type: "text", nullable: true),
                    date_of_birth = table.Column<DateOnly>(type: "date", nullable: true),
                    roll_number = table.Column<string>(type: "text", nullable: true),
                    gender = table.Column<string>(type: "text", nullable: true),
                    father_name = table.Column<string>(type: "text", nullable: true),
                    father_mobile = table.Column<string>(type: "text", nullable: true),
                    mother_name = table.Column<string>(type: "text", nullable: true),
                    mother_mobile = table.Column<string>(type: "text", nullable: true),
                    address = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_students", x => x.id);
                    table.ForeignKey(
                        name: "fk_students_sections_section_id",
                        column: x => x.section_id,
                        principalSchema: "academic",
                        principalTable: "sections",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "enrollments",
                schema: "academic",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    tenant_id = table.Column<Guid>(type: "uuid", nullable: false),
                    campus_id = table.Column<Guid>(type: "uuid", nullable: false),
                    student_id = table.Column<Guid>(type: "uuid", nullable: false),
                    class_id = table.Column<Guid>(type: "uuid", nullable: false),
                    section_id = table.Column<Guid>(type: "uuid", nullable: false),
                    enrolled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_enrollments", x => x.id);
                    table.ForeignKey(
                        name: "fk_enrollments_classes_class_id",
                        column: x => x.class_id,
                        principalSchema: "academic",
                        principalTable: "classes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_enrollments_sections_section_id",
                        column: x => x.section_id,
                        principalSchema: "academic",
                        principalTable: "sections",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_enrollments_students_student_id",
                        column: x => x.student_id,
                        principalSchema: "academic",
                        principalTable: "students",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_classes_tenant_id_campus_id_name",
                schema: "academic",
                table: "classes",
                columns: new[] { "tenant_id", "campus_id", "name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_enrollments_class_id",
                schema: "academic",
                table: "enrollments",
                column: "class_id");

            migrationBuilder.CreateIndex(
                name: "ix_enrollments_section_id",
                schema: "academic",
                table: "enrollments",
                column: "section_id");

            migrationBuilder.CreateIndex(
                name: "ix_enrollments_student_id",
                schema: "academic",
                table: "enrollments",
                column: "student_id");

            migrationBuilder.CreateIndex(
                name: "ix_enrollments_tenant_id_student_id_section_id",
                schema: "academic",
                table: "enrollments",
                columns: new[] { "tenant_id", "student_id", "section_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_sections_class_id",
                schema: "academic",
                table: "sections",
                column: "class_id");

            migrationBuilder.CreateIndex(
                name: "ix_sections_tenant_id_campus_id_class_id_name",
                schema: "academic",
                table: "sections",
                columns: new[] { "tenant_id", "campus_id", "class_id", "name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_students_section_id",
                schema: "academic",
                table: "students",
                column: "section_id");

            migrationBuilder.CreateIndex(
                name: "ix_students_tenant_id_admission_no",
                schema: "academic",
                table: "students",
                columns: new[] { "tenant_id", "admission_no" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "enrollments",
                schema: "academic");

            migrationBuilder.DropTable(
                name: "students",
                schema: "academic");

            migrationBuilder.DropTable(
                name: "sections",
                schema: "academic");

            migrationBuilder.DropTable(
                name: "classes",
                schema: "academic");
        }
    }
}
