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

        public void InsertInternDetails(string firstName, string lastName, string university, string gender, string email, string contactNo, string degree, string division, byte[] profileImage, byte[] cv)
        {
            string query = @"
                INSERT INTO InternDetails_two 
                (FirstName, LastName, University, Gender, Email, ContactNo, Degree, Division, ProfileImage, CV)
                VALUES 
                (@FirstName, @LastName, @University, @Gender, @PersonalEmail, @ContactNo, @Degree, @Division, @ProfileImage, @CV)";
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
                new SqlParameter("@CV", SqlDbType.VarBinary) { Value = (object)cv ?? DBNull.Value }
            };

            _sqlHelper.ExecuteNonQuery(query, CommandType.Text, parameters);
        }
    }
}
