using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseTrackApi.Migrations
{
    /// <inheritdoc />
    public partial class ChangeCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 7,
                column: "Name",
                value: "Education");

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Name" },
                values: new object[] { 8, "Others" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 7,
                column: "Name",
                value: "Others");
        }
    }
}
