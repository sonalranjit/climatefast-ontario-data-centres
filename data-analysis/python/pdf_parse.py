'''
Environmental assessment data comes with a link to related documents in the form:

https://www.accessenvironment.ene.gov.on.ca/AEWeb/ae/ViewDocument.action?documentRefID=<id number>

Where <id number> is usually the RSC number.

Each link downloads a zip file with unique file names. 

Example 1:
    The record
        Business: BRESCIA UNIVERSITY COLLEGE
        Approval number: R-010-5111384211
        Approval type: EASR-Air Emissions
        RSC number: 2159685
    The zip file contents
        "1 1000057794-EASR_confirmation.pdf"
        "2 Table 2 - Chemlist - Brescia June 13, 2019.pdf"
        "3 Brescia College AAR January 16, 2019 - Table 3.pdf"
    The files contain, respectively:
        Confirmation of registration from the Government of Ontario, standard letter
        Spreadsheet of chemicals 
        Acoustic assessment summary of different rooms
Example 2:
    The record
        Business: BRUNSWICK BIER WORKS INC.
        Approval number: R-010-5111358052
        Approval type: EASR-Air Emissions
        RSC number: 2155102
    The zip file contents
        "1 1000056979-EASR_confirmation.pdf"
        "2 EASR EST_Brunswick_May 2019_v1.0.pdf"
        "3 EASR AAST_Brunswick_May 2019_v1.0.pdf"
    The files contain, respectively:
        Confirmation of registration from the Government of Ontario, standard letter
        Esmission summary table
        Acoustic assessment summary table
'''
from pdfquery import PDFQuery

# TODO: Get data name from PDF, then handle the parsing and data collection
def analyze_pdf(pdf):
    name = pdf.pq('LTTextLineHorizontal')
    if name == "Emission Table Summary":
        data = pdf.pq('LTTextLineHorizontal')
        parse_easr()

# TODO: Parse out emission table data
# TODO: Confirm this data is the same across all emission tables
def parse_easr(data):
    emission_table_data = {
        "containment": "",
        "cas_no": "",
        
        "total_max_rate": "",
        "total_max_rate_metric": "",
        
        "air_dispersion_model": "",
        
        "max_poi_concentration": "",
        "max_poi_concentration_metric": "",
        "max_poi_concentration_1": "",
        "max_poi_concentration_2": "",
        
        "averaging_period_1": "",
        "averaging_period_2": "",
        "averaging_period_metric": "",
        
        "mecp_poi_limit_1": "",
        "mecp_poi_limit_2": "",
        "mecp_poi_limit_metric": "",

        "limiting_effect_1": "",
        "limiting_effect_2": "",

        "regulation_schedule_1": "",
        "regulation_schedule_2": "",

        "pct_mecp_poi_limit_1": "",
        "pct_mecp_poi_limit_2": ""
    }
    return emission_table_data

# TODO: Extracts 
def main():
    path_data = "../data/"

    pdf = PDFQuery(path_data + "1000056979-EASR_confirmation/2 EASR EST_Brunswick_May 2019_v1.0.pdf")
    
    pdf.load()

    pdf.tree.write("../data/pdf_tree_export.xml", pretty_print=True) # write the XML to a file for analysis
    # data we want is in the summary table
    # in LTPage, in LTTextBoxHorizontal, LTTextLineHorizontal for table titles
    # in LTTable, LTTextLineHorizontal for table values

    # LTTextLineHorizontal seems to be the main XML text element, must extract all of them, find patterns to get those of interest
    text_elements = pdf.pq('LTTextLineHorizontal')

    # Extract the text from the elements
    text = [t.text for t in text_elements]

    print(text)
    
if __name__ == '__main__':
    main()