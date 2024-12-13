using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Project_IRMS.Data.Common
{
   public  class SqlServerHelper
    {
        private readonly string _connectionString;

        public SqlServerHelper()
        {
            if (ConfigurationManager.ConnectionStrings[CommonConfig.SqlConnectionString] == null)
                throw new Exception("'" + CommonConfig.SqlConnectionString + "' is not found in config");

            _connectionString = ConfigurationManager.ConnectionStrings[CommonConfig.SqlConnectionString].ConnectionString;
        }

        public DataTable ExecuteQuery(string query)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                SqlDataAdapter adapter = new SqlDataAdapter(command);
                DataTable result = new DataTable();
                adapter.Fill(result);
                return result;
            }
        }
        public int ExecuteNonQuery(string query, CommandType commandType, SqlParameter[] parameters)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.CommandType = commandType;

                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    connection.Open();
                    return command.ExecuteNonQuery(); // Returns the number of affected rows
                }
            }
        }

    }
}
