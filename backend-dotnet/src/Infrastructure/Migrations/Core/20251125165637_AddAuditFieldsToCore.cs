using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations.Core
{
    /// <inheritdoc />
    public partial class AddAuditFieldsToCore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                schema: "core",
                table: "users",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                schema: "core",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "updated_by",
                schema: "core",
                table: "users",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                schema: "core",
                table: "tenants",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                schema: "core",
                table: "tenants",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "updated_by",
                schema: "core",
                table: "tenants",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                schema: "core",
                table: "campuses",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<bool>(
                name: "is_deleted",
                schema: "core",
                table: "campuses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "updated_by",
                schema: "core",
                table: "campuses",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "created_by",
                schema: "core",
                table: "users");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                schema: "core",
                table: "users");

            migrationBuilder.DropColumn(
                name: "updated_by",
                schema: "core",
                table: "users");

            migrationBuilder.DropColumn(
                name: "created_by",
                schema: "core",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                schema: "core",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "updated_by",
                schema: "core",
                table: "tenants");

            migrationBuilder.DropColumn(
                name: "created_by",
                schema: "core",
                table: "campuses");

            migrationBuilder.DropColumn(
                name: "is_deleted",
                schema: "core",
                table: "campuses");

            migrationBuilder.DropColumn(
                name: "updated_by",
                schema: "core",
                table: "campuses");
        }
    }
}
