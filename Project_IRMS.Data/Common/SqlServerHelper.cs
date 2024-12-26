using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Project_IRMS.Data.Common
{
    public class SqlServerHelper
    {
        private readonly string _connectionString;

        // Constructor to initialize the connection string from configuration
        public SqlServerHelper()
        {
            // Retrieve connection string from the configuration file
            string connectionStringName = CommonConfig.SqlConnectionString;
            if (ConfigurationManager.ConnectionStrings[connectionStringName] == null)
                throw new Exception($"'{connectionStringName}' is not found in config");

            _connectionString = ConfigurationManager.ConnectionStrings[connectionStringName].ConnectionString;
        }

        // Execute a query that returns a DataTable
        public DataTable ExecuteQuery(string query, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
        {
            // Create a DataTable to store the query result
            DataTable result = new DataTable();

            // Establish a connection to the database
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                // Create a command object to execute the query
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.CommandType = commandType;

                    // Add parameters to the command if any are provided
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    // Open the connection and fill the DataTable with the query result
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(result);
                    }
                }
            }

            // Return the result as a DataTable
            return result;
        }

        // Execute a query that doesn't return results (e.g., INSERT, UPDATE, DELETE)
        public int ExecuteNonQuery(string query, CommandType commandType = CommandType.Text, SqlParameter[] parameters = null)
        {
            // Establish a connection to the database
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                // Create a command object to execute the query
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.CommandType = commandType;

                    // Add parameters to the command if any are provided
                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters);
                    }

                    // Open the connection and execute the query
                    connection.Open();
                    return command.ExecuteNonQuery(); // Returns the number of affected rows
                }
            }
        }
    }
}
