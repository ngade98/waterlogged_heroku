#https://developer.here.com/blog/getting-started-with-geocoding-exif-image-metadata-in-python3
#ONLY WORKS FOR IMAGES WITH METADATA OTHERWISE IT RAISES AN EXCPETION

#IMPORTS
from PIL import Image
from PIL.ExifTags import TAGS
from PIL.ExifTags import GPSTAGS

#DEFINE AS EXIF STRUCTURE
def get_exif(filename):
    image = Image.open(filename)
    image.verify()
    return image._getexif()

#exif = get_exif('temp.jpg')

#LABELED EXIF VALUES ALONG WITH KEYS 
def get_labeled_exif(exif):
    labeled = {}
    for (key, val) in exif.items():
        labeled[TAGS.get(key)] = val

    return labeled

#labeled = get_labeled_exif(exif)
# print(labeled)

#GEOLOCATION EXTRACTION
#WILL PRINT NO EXIF FOUND IF GEOLOCATION DATA ABSENT
def get_geotagging(exif):
    if not exif:
        raise ValueError("No EXIF metadata found")

    geotagging = {}
    for (idx, tag) in TAGS.items():
        if tag == 'GPSInfo':
            if idx not in exif:
                raise ValueError("No EXIF geotagging found")

            for (key, val) in GPSTAGS.items():
                if key in exif[idx]:
                    geotagging[val] = exif[idx][key]

    return geotagging

#geotags = get_geotagging(exif)
#print(geotags)

#USED TO CONVERT LATITUDE AND LONGITUDE TO DECIMAL FORMAT
def get_decimal_from_dms(dms, ref):
    
    degrees = dms[0][0] / dms[0][1]
    minutes = dms[1][0] / dms[1][1] / 60.0
    seconds = dms[2][0] / dms[2][1] / 3600.0

    if ref in ['S', 'W']:
        degrees = -degrees
        minutes = -minutes
        seconds = -seconds

    return round(degrees + minutes + seconds, 5)

#COMPILE ALL METADATA INTO ONE FUNCTION FOR SIMPLICITY 
#I.E. LAT, LONG, DATE, TIME
def get_metadata(geotags):

    lat = get_decimal_from_dms(geotags['GPSLatitude'], geotags['GPSLatitudeRef'])
    lon = get_decimal_from_dms(geotags['GPSLongitude'], geotags['GPSLongitudeRef'])
    print(lat)
    print(lon)
    #date = geotags['GPSDateStamp']
    #time = geotags['GPSTimeStamp']
    #print(date)
    #print(time)
   # return (lat, lon, date, time)
    return (lat, lon)

#latitude, longitude, date, time
#print(get_metadata(geotags))