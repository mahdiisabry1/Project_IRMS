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
            _internData.InsertInternDetails(tableName, firstName, lastName, university, gender, email, contactNo, degree, division, profileImage, cv, status);
        }

        public void UpdateInternDetails(string tablename, string internId, string firstName, string lastName, string university, string gender, string email, string contactNo, string degree, string division, string status)
        {
            _internData.UpdateInternDetails(tablename, internId, firstName, lastName, university, gender, email, contactNo, degree, division, status);
        }
        public void DeleteIntern(string tablename, string internId)
        {
            _internData.DeleteIntern(tablename, internId);
        }
    }
}