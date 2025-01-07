using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Project_IRMS.Data.Common;
using System.Data.SqlClient;

namespace Project_IRMS.Data
{
    public class ViewInternDetails
    {
        private readonly SqlServerHelper _sqlHelper;

        public ViewInternDetails()
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
                new SqlParameter("@Status", "new")
            };

            return _sqlHelper.ExecuteQuery(query, CommandType.Text, parameters);
        }

        public void InsertInternDetails(string tableName, string firstName, string lastName, string university, string gender, string email, string contactNo, string degree, string division, byte[] profileImage, byte[] cv,string status)
        {
            ValidateTableName(tableName); // Ensure table name is valid

            string query = $@"
                INSERT INTO {tableName}
                (FirstName, LastName, University, Gender, Email, ContactNo, Degree, Division, ProfileImage, CV,Status)
                VALUES 
                (@FirstName, @LastName, @University, @Gender, @Email, @ContactNo, @Degree, @Division, @ProfileImage, @CV,@Status)";

            SqlParameter[] parameters = {
                new SqlParameter("@FirstName", firstName),
                new SqlParameter("@LastName", lastName),
                new SqlParameter("@University", university),
                new SqlParameter("@Gender", gender),
                new SqlParameter("@Email", email),
                new SqlParameter("@ContactNo", contactNo),
                new SqlParameter("@Degree", degree),
                new SqlParameter("@Division", division),
                new SqlParameter("@ProfileImage", SqlDbType.VarBinary) { Value = (object)profileImage ?? DBNull.Value },
                new SqlParameter("@CV", SqlDbType.VarBinary) { Value = (object)cv ?? DBNull.Value },
                new SqlParameter("@Status", status)
            };

            _sqlHelper.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

        public void DeleteInternDetails(string tableName, int id)
        {
            ValidateTableName(tableName); // Ensure table name is valid

            string query = $@"
                DELETE FROM {tableName}
                WHERE InternID = @ID";

            SqlParameter[] parameters = {
                new SqlParameter("@ID", id)
            };

            _sqlHelper.ExecuteNonQuery(query, CommandType.Text, parameters);
        }
    }
}
