namespace Project_IRMS.Models
{
    public class Intern
    {
        public int InternID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string University { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string ContactNo { get; set; }
        public string Degree { get; set; }
        public string Division { get; set; }
        public byte[] ProfileImage { get; set; }
        public byte[] CV { get; set; }
    }
}
