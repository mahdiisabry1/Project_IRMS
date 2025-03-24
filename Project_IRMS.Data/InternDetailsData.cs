using System;
using System.Linq;
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

        public void UpdateInternDetails(string tablename, string internId, string firstName, string lastName, string university, string gender, string email, string contactNo, string degree, string division, string status)
        {

            string[] allowedTables = { "InternDetails", "hr", "it" };
            if (!allowedTables.Contains(tablename))
                throw new ArgumentException("Invalid table name.");
            // Construct the update query (excludes ProfileImage and CV)
            string query = $@"
            UPDATE {tablename}
            SET 
                FirstName = @FirstName,
                LastName = @LastName,
                University = @University,
                Gender = @Gender,
                Email = @PersonalEmail,
                ContactNo = @ContactNo,
                Degree = @Degree,
                Division = @Division,
                Status = @status
            WHERE InternId = @InternId";

            SqlParameter[] parameters = {
            new SqlParameter("@InternId", internId),
            new SqlParameter("@FirstName", firstName),
            new SqlParameter("@LastName", lastName),
            new SqlParameter("@University", university),
            new SqlParameter("@Gender", gender),
            new SqlParameter("@PersonalEmail", email),
            new SqlParameter("@ContactNo", contactNo),
            new SqlParameter("@Degree", degree),
            new SqlParameter("@Division", division),
            new SqlParameter("@status", status)
        };

            _sqlHelper.ExecuteNonQuery(query, CommandType.Text, parameters);
        }

        public void DeleteIntern(string tablename, string internId)
        {
            string[] allowedTables = { "InternDetails", "hr", "it" };
            if (!allowedTables.Contains(tablename))
                throw new ArgumentException("Invalid table name.");

            string query = $@"Delete from {tablename}
                             Where InternId = @InternId";
            SqlParameter[] parameters =
            {
                new SqlParameter("@InternId", internId)
            };
            _sqlHelper.ExecuteNonQuery(query, CommandType.Text, parameters);
        }
    }
}