using System.Web;
using System.Web.Optimization;

namespace Project_IRMS
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/JqueryMaster/jquery-{version}.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/JqueryMaster/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/JqueryMaster/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/Bootstrap/bootstrap.bundle.min.js",
                      "~/Scripts/jquery/jquery.min.js",
                      "~/Scripts/jquery/jquery.overlayScrollbars.min.js",
                      "~/Scripts/AdminLTE/adminlte.min.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(


                      "~/Content/overlayScrollbars/OverlayScrollbars.min.css",
                      "~/Content/adminlte/adminlte.min.css"
                      ));
        }
    }
}
