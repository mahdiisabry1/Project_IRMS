using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Collections.Generic;
using System.Drawing;
using Microsoft.Office.Interop.Word;
using Tesseract;
using iTextSharp.text.pdf.parser;
using Project_IRMS.Buisness;
using IOPath = System.IO.Path;

namespace Project_IRMS.Controllers
{
    public class CreateRequestController : Controller
    {
        private readonly InternDetailsService _internService;

        public CreateRequestController()
        {
            _internService = new InternDetailsService();
        }

        // GET: CreateRequest
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SubmitRequest(FormCollection form, HttpPostedFileBase profileImage, HttpPostedFileBase cvFile)
        {
            try
            {
                var tableName = Session["Tablename"]?.ToString();
                if (string.IsNullOrEmpty(tableName))
                {
                    return Json(new { success = false, message = "Table name is missing." });
                }

                // Retrieve form data
                string firstName = form["firstName"];
                string lastName = form["lastName"];
                string university = form["university"];
                string gender = form["gender"];
                string email = form["email"];
                string contactNo = form["contactNo"];
                string degree = form["degree"];
                string division = form["division"];

                byte[] profileImageBytes = null;
                byte[] cvBytes = null;

                // Handle Profile Image
                if (profileImage != null && profileImage.ContentLength > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        profileImage.InputStream.CopyTo(ms);
                        profileImageBytes = ms.ToArray();
                    }
                }

                // Handle CV File
                if (cvFile != null && cvFile.ContentLength > 0)
                {
                    using (var ms = new MemoryStream())
                    {
                        cvFile.InputStream.CopyTo(ms);
                        cvBytes = ms.ToArray();  // Convert CV file to byte array
                    }
                }

                // Save details to the database
                _internService.AddInternDetails(
                    tableName,
                    firstName,
                    lastName,
                    university,
                    gender,
                    email,
                    contactNo,
                    degree,
                    division,
                    profileImageBytes,
                    cvBytes
                );

                return Json(new { success = true, message = "Request submitted successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }


        // Upload and process CV
        [HttpPost]
        public JsonResult UploadCv(HttpPostedFileBase file)
        {
            if (file == null || file.ContentLength <= 0)
            {
                return Json(new { success = false, message = "No file uploaded." });
            }

            try
            {
                string tempFolderPath = Server.MapPath("~/Temp");
                Directory.CreateDirectory(tempFolderPath); // Ensure temp directory exists
                string tempFilePath = IOPath.Combine(tempFolderPath, file.FileName);
                file.SaveAs(tempFilePath);

                string extractedText = ExtractTextBasedOnFileType(tempFilePath, file.FileName);
                var parsedData = ParseCvText(extractedText);

                return Json(new { success = true, data = parsedData });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        // Extract text based on file type
        private string ExtractTextBasedOnFileType(string filePath, string fileName)
        {
            if (fileName.EndsWith(".pdf"))
            {
                return ExtractTextFromPdf(filePath);
            }
            else if (fileName.EndsWith(".doc") || fileName.EndsWith(".docx"))
            {
                return ExtractTextFromWord(filePath);
            }
            else
            {
                throw new NotSupportedException("Unsupported file type.");
            }
        }

        // Extract text from PDF using iTextSharp and OCR
        private string ExtractTextFromPdf(string filePath)
        {
            StringBuilder text = new StringBuilder();

            try
            {
                using (var reader = new iTextSharp.text.pdf.PdfReader(filePath))
                {
                    for (int i = 1; i <= reader.NumberOfPages; i++)
                    {
                        string pageText = PdfTextExtractor.GetTextFromPage(reader, i);
                        text.Append(!string.IsNullOrWhiteSpace(pageText) ? pageText : ExtractTextFromPdfWithTesseract(filePath, i));
                    }
                }
            }
            catch (Exception ex)
            {
                text.Append($"Error extracting text from PDF: {ex.Message}");
            }

            return text.ToString();
        }

        // Perform OCR on PDF page using Tesseract
        private string ExtractTextFromPdfWithTesseract(string filePath, int pageNumber)
        {
            try
            {
                Bitmap pdfImage = ConvertPdfPageToImage(filePath, pageNumber);
                using (var engine = new TesseractEngine(@"./tessdata", "eng", EngineMode.Default))
                using (var page = engine.Process(pdfImage))
                {
                    return page.GetText();
                }
            }
            catch (Exception ex)
            {
                return $"Error performing OCR: {ex.Message}";
            }
        }

        // Placeholder: Convert PDF page to image
        private Bitmap ConvertPdfPageToImage(string filePath, int pageNumber)
        {
            return new Bitmap(1, 1); // Replace with actual implementation
        }

        // Extract text from Word document
        private string ExtractTextFromWord(string filePath)
        {
            Application wordApp = new Application();
            Document doc = null;

            try
            {
                doc = wordApp.Documents.Open(filePath);
                return doc.Content.Text;
            }
            finally
            {
                doc?.Close(false);
                wordApp.Quit();
            }
        }

        // Parse CV text for details
        private Dictionary<string, string> ParseCvText(string text)
        {
            return new Dictionary<string, string>
            {
                ["firstName"] = ExtractName(text, "First Name"),
                ["lastName"] = ExtractName(text, "Last Name"),
                ["email"] = Regex.Match(text, @"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b").Value,
                ["contactNo"] = Regex.Match(text, @"\b\d{10}\b").Value
            };
        }

        // Helper: Extract name based on label
        private string ExtractName(string text, string label)
        {
            var match = Regex.Match(text, $@"(?<={label}[:\s])([A-Za-z]+)");
            return match.Success ? match.Value : string.Empty;
        }
    }
}
