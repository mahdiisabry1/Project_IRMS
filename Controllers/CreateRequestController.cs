using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using Microsoft.Office.Interop.Word;
using Tesseract;
using iTextSharp.text.pdf.parser;
using System.Collections.Generic;
using System.Drawing;
using Project_IRMS.Buisness;


using IOPath = System.IO.Path;

namespace Project_IRMS.Controllers
{
    public class CreateRequestController : Controller
    {
        // GET: CreateRequest
        public ActionResult Index()
        {
            return View();
        }
        //databse
        private readonly InternDetailsService _internService;

        public CreateRequestController()
        {
            _internService = new InternDetailsService();
        }

        [HttpPost]
        public ActionResult SubmitRequest(FormCollection form, HttpPostedFileBase profileImage, HttpPostedFileBase cv)
        {
            string firstName = form["firstName"];
            string lastName = form["lastName"];
            string university = form["university"];
            string gender = form["gender"];
            string email = form["email"];
            string contactNo = form["contactNo"];
            string degree = form["degree"];
            string division = form["division"];
            string profileImagePath = null;
            string cvPath = null;

            // Handle file uploads (if provided)
            if (profileImage != null)
            {
                profileImagePath = Server.MapPath("~/UploadedFiles/Profiles/" + profileImage.FileName);
                profileImage.SaveAs(profileImagePath);
            }

            if (cv != null)
            {
                cvPath = Server.MapPath("~/UploadedFiles/CVs/" + cv.FileName);
                cv.SaveAs(cvPath);
            }

            // Save data
            _internService.AddInternDetails(firstName, lastName, university, gender, email, contactNo, degree, division, profileImagePath, cvPath);

            return RedirectToAction("Index");
        }
        //end
        [HttpPost]
        public JsonResult UploadCv(HttpPostedFileBase file)
        {
            if (file == null || file.ContentLength == 0)
            {
                return Json(new { success = false, message = "No file uploaded." });
            }

            try
            {
                // Ensure the temp folder exists
                string tempFolderPath = Server.MapPath("~/Temp");
                if (!Directory.Exists(tempFolderPath))
                {
                    Directory.CreateDirectory(tempFolderPath);
                }

                string extractedText = "";

                // Save the file to the temporary location
                string tempFilePath = IOPath.Combine(tempFolderPath, IOPath.GetFileName(file.FileName));
                file.SaveAs(tempFilePath);

                // Extract text based on file type
                if (file.FileName.EndsWith(".pdf"))
                {
                    extractedText = ExtractTextFromPdf(tempFilePath);
                }
                else if (file.FileName.EndsWith(".doc") || file.FileName.EndsWith(".docx"))
                {
                    extractedText = ExtractTextFromWord(tempFilePath);
                }
                // Log the extracted text for debugging
                System.Diagnostics.Debug.WriteLine("Extracted Text: " + extractedText);

                // Parse the extracted text for details
                var parsedData = ParseCvText(extractedText);

                // Return the parsed data to the client
                return Json(new { success = true, data = parsedData });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        // Extract text from PDF using iTextSharp and OCR if necessary
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
                        if (!string.IsNullOrWhiteSpace(pageText))
                        {
                            text.Append(pageText);
                        }
                        else
                        {
                            // If the page is image-based, use OCR
                            text.Append(ExtractTextFromPdfWithTesseract(filePath, i));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                text.Append("Error extracting text from PDF: " + ex.Message);
            }

            return text.ToString();
        }

        // Perform OCR using Tesseract for images in PDF
        private string ExtractTextFromPdfWithTesseract(string filePath, int pageNumber)
        {
            string ocrText = string.Empty;

            try
            {
                var pdfImage = ConvertPdfPageToImage(filePath, pageNumber);
                using (var engine = new TesseractEngine(@"./tessdata", "eng", EngineMode.Default))
                {
                    using (var page = engine.Process(pdfImage))
                    {
                        ocrText = page.GetText();
                    }
                }
            }
            catch (Exception ex)
            {
                ocrText = "Error performing OCR: " + ex.Message;
            }

            return ocrText;
        }

        // Convert a PDF page to an image (placeholder for actual image conversion)
        private Bitmap ConvertPdfPageToImage(string filePath, int pageNumber)
        {
            return new Bitmap(1, 1);  // Placeholder for actual image conversion
        }

        // Extract text from Word document (DOCX or DOC)
        private string ExtractTextFromWord(string filePath)
        {
            Application wordApp = new Application();
            Document doc = wordApp.Documents.Open(filePath);
            string text = doc.Content.Text;
            doc.Close(false);
            wordApp.Quit();
            return text;
        }

        // Parse the extracted text for first name, last name, email, and contact number
        private Dictionary<string, string> ParseCvText(string text)
        {
            var data = new Dictionary<string, string>
            {
                ["firstName"] = ExtractName(text, "First Name"),
                ["lastName"] = ExtractName(text, "Last Name"),
                ["email"] = Regex.Match(text, @"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b").Value,
                ["contactNo"] = Regex.Match(text, @"\b\d{10}\b").Value
            };

            return data;
        }

        // Helper method to extract names based on label (First Name, Last Name)
        private string ExtractName(string text, string label)
        {
            var match = Regex.Match(text, $@"(?<={label}[:\s])([A-Za-z]+)");
            return match.Success ? match.Value : string.Empty;
        }
    }
}
