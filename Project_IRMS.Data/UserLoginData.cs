using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Project_IRMS.Data.Common;


namespace Project_IRMS.Data
{
   public class UserLoginData
    {
        private readonly SqlServerHelper _sqlHelper;

        public UserLoginData()
        {
            _sqlHelper = new SqlServerHelper();
        }
        public DataTable AuthenticateUser(string username, string password)
        {
            // SQL query to validate the user's credentials.
            string query = @"
                SELECT *
                FROM Login
                WHERE Username = @Username AND Password = @Password";

            // Create parameters for the query to prevent SQL injection.
            SqlParameter[] parameters = {
                new SqlParameter("@Username", SqlDbType.NVarChar) { Value = username },
                new SqlParameter("@Password", SqlDbType.NVarChar) { Value = password }
            };

            // Execute the query using SqlServerHelper and return the result as a DataTable.
            return _sqlHelper.ExecuteQuery(query, CommandType.Text, parameters);
        }

    }
}
