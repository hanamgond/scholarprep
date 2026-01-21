using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations.Academic
{
    /// <inheritdoc />
    public partial class AddAuditFieldsToAcademic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                schema: "academic",
                table: "students",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                schema: "academic",
                table: "students",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "updated_by",
                schema: "academic",
                table: "students",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                schema: "academic",
                table: "sections",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                schema: "academic",
                table: "sections",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "updated_by",
                schema: "academic",
                table: "sections",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                schema: "academic",
                table: "enrollments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                schema: "academic",
                table: "enrollments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "updated_by",
                schema: "academic",
                table: "enrollments",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                schema: "academic",
                table: "classes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                schema: "academic",
                table: "classes",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "updated_by",
                schema: "academic",
                table: "classes",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "created_by",
                schema: "academic",
                table: "students");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                schema: "academic",
                table: "students");

            migrationBuilder.DropColumn(
                name: "updated_by",
                schema: "academic",
                table: "students");

            migrationBuilder.DropColumn(
                name: "created_by",
                schema: "academic",
                table: "sections");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                schema: "academic",
                table: "sections");

            migrationBuilder.DropColumn(
                name: "updated_by",
                schema: "academic",
                table: "sections");

            migrationBuilder.DropColumn(
                name: "created_by",
                schema: "academic",
                table: "enrollments");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                schema: "academic",
                table: "enrollments");

            migrationBuilder.DropColumn(
                name: "updated_by",
                schema: "academic",
                table: "enrollments");

            migrationBuilder.DropColumn(
                name: "created_by",
                schema: "academic",
                table: "classes");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                schema: "academic",
                table: "classes");

            migrationBuilder.DropColumn(
                name: "updated_by",
                schema: "academic",
                table: "classes");
        }
    }
}
