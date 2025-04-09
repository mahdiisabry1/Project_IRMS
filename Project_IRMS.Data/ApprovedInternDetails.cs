using System;
using System.Linq;
using System.Data;
using Project_IRMS.Data.Common;
using System.Data.SqlClient;

namespace Project_IRMS.Data
{
    public class ApprovedInternDetails
    {
        private readonly SqlServerHelper _sqlHelper;

        public ApprovedInternDetails()
        {
            _sqlHelper = new SqlServerHelper();
        }
        // Method to validate table name against allowed list
        private void ValidateTableName(string tableName)
        {
            string[] allowedTables = { "InternDetails", "hr", "it" }; // Add your valid table names here
            if (!allowedTables.Contains(tableName))
                throw new ArgumentException($"Invalid table name: {tableName}");
        }

        public DataTable GetInternDetails(string tablename)
        {
            ValidateTableName(tablename); // Ensure table name is valid

            string query = $@"SELECT * FROM {tablename} WHERE Status = @Status";

            SqlParameter[] parameters = {
                new SqlParameter("@Status", "approve")
            };

            return _sqlHelper.ExecuteQuery(query, CommandType.Text, parameters);
        }
    }
}