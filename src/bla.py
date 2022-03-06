# create a dictionary
data = {}
     
# Open a csv reader called DictReader
with open("ULF Movies - Movies.csv", encoding='utf-8') as csvf:
    csvReader = csv.DictReader(csvf)
        
    # Convert each row into a dictionary
    # and add it to data
    for row in csvReader:
        print(row)