#https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Testing
#https://test-driven-django-development.readthedocs.io/en/latest/02-models.html
#https://www.programiz.com/python-programming/datetime

from django.test import TestCase
from waterlogged.models import Image

class ImageModelTest(TestCase):
    @classmethod
    #DEFINE DEFAULT VALUES TO TEST AGAINST
    def setUpTestData(cls):
        Image.objects.create(
            filepath = '/localdir/xyz', 
            #flood_date = 2020-03-27T16:49:05.123456Z,
            pre_post = True, 
            longitude = 20.1234, 
            latitude = 21.1234, 
            address = '400 Bizzell St.', 
            #user_uploaded = 5, 
            #pair_index = 12, 
            #approved_by_admin = False, 
            #pair_approved_by_admin = True, 
            #flood_height = 123.321, 
            #source = 'Google Images', 
            #pair_attempted = True
        )

    #TO VERIFY THAT THE DATABASE IS READING THE FILEPATH ACCURATELY
    def test_filepath_is_accurate(self):
        img = Image.objects.get(id=1)
        filepath_label = img._meta.get_field('filepath').verbose_name

        self.assertEquals(filepath_label, 'filepath')

    #TO VERIFY THAT THE MAX FILEPATH SIZE CAN ONLY BE 75 CHARACTERS
    def test_filepath_max_length(self):
        img = Image.objects.get(id=1)
        filepath_max_length = img._meta.get_field('filepath').max_length

        self.assertEquals(filepath_max_length, 75)

    #TO ASSERT THAT THE PRE_POST TRUTH VALUES ENTER THE DB CORRECTLY 
    def test_pre_post_is_true(self):
        img = Image.objects.get(id=1)

        self.assertIs(img.pre_post, True)
    
    #TO VERIFY THAT LONGITUDE MATCHES THE DB 
    def test_longitude_is_accurate(self):
        img = Image.objects.get(id=1)

        self.assertEqual(img.longitude, 20.1234)

    #TO VERIFY THAT LATITUDE MATCHES THE DB
    def test_latitude_is_accurate(self):
        img = Image.objects.get(id=1)

        self.assertEqual(img.latitude, 21.1234)
   
    #TO VERIFY THAT THE MAX ADDRESS SIZE CAN ONLY BE 300 CHARACTERS
    def test_address_max_length(self):
        img = Image.objects.get(id=1)
        address_max_length = img._meta.get_field('address').max_length

        self.assertEquals(address_max_length, 300)