using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using Project_IRMS.Data.Common;
using System.Data;


namespace Project_IRMS.Data
{
    public class InternDetailsData
    {
        private readonly SqlServerHelper _sqlHelper;

        public InternDetailsData()
        {
            _sqlHelper = new SqlServerHelper();
        }
        public void InsertInternDetails(string tableName, string firstName, string lastName, string university, string gender, string email, string contactNo, string degree, string division, byte[] profileImage, byte[] cv, string status)
        {
            // Validate table name against a list of allowed names
            string[] allowedTables = { "InternDetails", "hr", "it" }; // Add your valid table names here
            if (!allowedTables.Contains(tableName))
                throw new ArgumentException("Invalid table name.");

            // Construct the query with the validated table name
            string query = $@"
        INSERT INTO {tableName}
        (FirstName, LastName, University, Gender, Email, ContactNo, Degree, Division, ProfileImage, CV,Status)
        VALUES 
        (@FirstName, @LastName, @University, @Gender, @PersonalEmail, @ContactNo, @Degree, @Division, @ProfileImage, @CV,@status)";

            SqlParameter[] parameters = {
        new SqlParameter("@FirstName", firstName),
        new SqlParameter("@LastName", lastName),
        new SqlParameter("@University", university),
        new SqlParameter("@Gender", gender),
        new SqlParameter("@PersonalEmail", email),
        new SqlParameter("@ContactNo", contactNo),
        new SqlParameter("@Degree", degree),
        new SqlParameter("@Division", division),
        new SqlParameter("@ProfileImage", SqlDbType.VarBinary) { Value = (object)profileImage ?? DBNull.Value },
        new SqlParameter("@CV", SqlDbType.VarBinary) { Value = (object)cv ?? DBNull.Value },
         new SqlParameter("@status", status)

    };

            _sqlHelper.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

    }
}