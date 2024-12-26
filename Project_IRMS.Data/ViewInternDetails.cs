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

        public DataTable GetInternDetails(string tablename)
        {
            // Validate table name against a list of allowed names
            string[] allowedTables = { "InternDetails", "hrInterns", "itInterns" }; // Add your valid table names here
            if (!allowedTables.Contains(tablename))
                throw new ArgumentException("Invalid table name.");

            //
            string query = $@"SELECT * from {tablename} ";

            return _sqlHelper.ExecuteQuery(query);
        }
        //

        public void InsertInternDetails(string tableName, string firstName, string lastName, string university, string email, string contactNo, string degree, string division, byte[] profileImage, byte[] cv)
        {
            string query = $@"
                INSERT INTO {tableName}
                (FirstName, LastName, University, Email, ContactNo, Degree, Division,  ProfileImage, CV)
                VALUES 
                (@FirstName, @LastName, @University, @Email, @ContactNo, @Degree, @Division, @ProfileImage, @CV)";

            SqlParameter[] parameters = {
                new SqlParameter("@FirstName", firstName),
                new SqlParameter("@LastName", lastName),
                new SqlParameter("@University", university),
                new SqlParameter("@Email", email),
                new SqlParameter("@ContactNo", contactNo),
                new SqlParameter("@Degree", degree),
                new SqlParameter("@Division", division),
                 new SqlParameter("@ProfileImage", SqlDbType.VarBinary) { Value = (object)profileImage ?? DBNull.Value },
        new SqlParameter("@CV", SqlDbType.VarBinary) { Value = (object)cv ?? DBNull.Value }
            };

            _sqlHelper.ExecuteNonQuery(query, CommandType.Text, parameters);
        }
        //
        //
        public void DeleteInternDetails(string tableName, string email)
        {
            string query = $@"
                DELETE FROM {tableName}
                WHERE Email = @Email";

            SqlParameter[] parameters = {
                new SqlParameter("@Email", email)
            };

            _sqlHelper.ExecuteNonQuery(query, CommandType.Text, parameters);
        }
        //
    }
}
