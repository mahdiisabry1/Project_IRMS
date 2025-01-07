using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Project_IRMS.Data;

namespace Project_IRMS.Buisness
{
    public class InternDetailsService
    {
        private readonly InternDetailsData _internData;

        public InternDetailsService()
        {
            _internData = new InternDetailsData();
        }

        public void AddInternDetails(string tableName, string firstName, string lastName, string university, string gender, string email, string contactNo, string degree, string division, byte[] profileImage, byte[] cv, string status)
        {
            _internData.InsertInternDetails(tableName,  firstName, lastName, university, gender, email, contactNo, degree, division, profileImage, cv,status);
        }
    }
}
